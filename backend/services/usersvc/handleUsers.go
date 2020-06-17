package usersvc

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	c "github.com/gpng/techhunt-2020/backend/constants"
	"github.com/gpng/techhunt-2020/backend/models"
	u "github.com/gpng/techhunt-2020/backend/utils/utils"
	"github.com/jinzhu/gorm"
)

// handleSearch godoc
// @Summary Search employee data
// @Description Search employee data
// @Tags employees
// @Accept  json
// @Produce  json
// @Param minSalary query number true "Minimum salary"
// @Param maxSalary query number true "Maximum salary"
// @Param offset query number true "Offset results" minimum(0)
// @Param limit query number true "Number of results" minimum(1)
// @Param sort query string true "Sort by parameter, etc +name, -login" Enums(+name, -name, +login, -login, +id, -id, +salary, -salary)
// @Router /users [get]
func (s *Service) handleSearch() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queryMinSalary := r.URL.Query().Get("minSalary")
		queryMaxSalary := r.URL.Query().Get("maxSalary")
		queryOffset := r.URL.Query().Get("offset")
		queryLimit := r.URL.Query().Get("limit")
		querySort := r.URL.Query().Get("sort")

		// check for missing params
		if queryMinSalary == "" || queryMaxSalary == "" || queryOffset == "" || queryLimit == "" || querySort == "" {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrMissingParam, fmt.Errorf("Missing params"), "Missing params"),
			)
			return
		}

		searchParams := models.EmployeeSearch{}

		// validate params
		minSalary, err := strconv.Atoi(queryMinSalary)
		if err != nil || minSalary < 0 {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, "minSalary must be a number greater or equal to 0"),
			)
			return
		}
		searchParams.MinSalary = minSalary

		maxSalary, err := strconv.Atoi(queryMaxSalary)
		if err != nil || maxSalary < 0 || maxSalary < minSalary {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, "maxSalary must be a number greater or equal to 0, and greater than minSalary"),
			)
			return
		}
		searchParams.MaxSalary = maxSalary

		offset, err := strconv.Atoi(queryOffset)
		if err != nil || offset < 0 {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, "offset must be a number greater or equal to 0"),
			)
			return
		}
		searchParams.Offset = offset

		limit, err := strconv.Atoi(queryLimit)
		if err != nil || limit < 1 {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, "limit must be a number greater or equal to 1"),
			)
			return
		}
		searchParams.Limit = limit

		sortBy, sortAsc, err := parseSort(querySort)
		if err != nil {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, err.Error()),
			)
		}

		searchParams.SortBy = sortBy
		searchParams.SortAsc = sortAsc

		employees, err := searchParams.Search(s.db)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			s.render.RespondWithStatus(w, r, http.StatusInternalServerError,
				s.render.ErrorMessage(c.ErrDbLookupFailed, err, "Failed to lookup employees"),
			)
		}

		s.render.Respond(w, r, s.render.DataMessage(employees, true, "Search success!"))
	}
}

// parseSort from query string into sort by param and order
func parseSort(sortQuery string) (string, bool, error) {
	invalidError := fmt.Errorf("sort must be in the form +param (eg +name, -salary)")
	// cannot be less than 1 char as the first character must already be + or -
	if len(sortQuery) <= 1 {
		return "", true, invalidError
	}

	// + for ascending, - for descending, otherwise invalid
	sortOrderChar := sortQuery[:1]
	sortAsc := true
	switch sortOrderChar {
	case "+":
		sortAsc = true
	case "-":
		sortAsc = false
	default:
		return "", true, invalidError
	}

	sortByString := sortQuery[1:]
	sortBy := models.SortBy(sortByString)
	if err := sortBy.IsValid(); err != nil {
		return "", true, invalidError
	}
	return sortByString, sortAsc, nil
}

// handleUpload godoc
// @Summary Bulk upserts employee data
// @Description Uploads csv, and bulk upserts employee data in db
// @Tags employees
// @Accept  json
// @Produce  json
// @Param file formData file true "Employee CSV"
// @Router /users/upload [post]
func (s *Service) handleUpload() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		file, _, err := r.FormFile("file")
		defer file.Close()
		if err != nil {
			u.LogError(err)
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidFile, err, "Invalid file"),
			)
		}

		var buffer bytes.Buffer
		io.Copy(&buffer, file)

		employees, err := parseCSVToEmployees(buffer.String())
		if err != nil {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrCsvInvalid, err, err.Error()),
			)
			return
		}

		err = models.BulkUpsertEmployees(s.db, employees)
		if err != nil {
			message := "Failed to update employees"
			if err.Error() == c.StringErrDuplicateEmployeeLogin {
				message = "Duplicate login detected"
			}
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrDbUpdateFailed, err, message),
			)
			return
		}

		s.render.Respond(w, r, s.render.Message(true, "Employees updated successfully"))
	}
}

// parseCSVToEmployees parses a csv string into a slice of employees
func parseCSVToEmployees(csvString string) ([]models.Employee, error) {
	data := strings.TrimSpace(csvString)

	rowsString := strings.Split(data, "\n")

	// check if no data
	if len(rowsString) <= 0 {
		return nil, fmt.Errorf("No data found in csv")
	}

	// remove headers
	rowsString = rowsString[1:]

	employees := []models.Employee{}
	for _, rowString := range rowsString {
		trimmed := strings.TrimSpace(rowString)

		// skip row if it is a comment
		if trimmed[0] == '#' {
			continue
		}

		cols := strings.Split(trimmed, ",")
		if len(cols) != 4 {
			return nil, fmt.Errorf("Incorrect number of columns found")
		}
		employee := models.Employee{}
		for i, val := range cols {
			switch i {
			case 0: // id
				employee.ID = val
			case 1: // login
				employee.Login = val
			case 2: // name
				employee.Name = val
			case 3: // salary
				salary, err := strconv.ParseFloat(val, 64)
				if err != nil || salary <= 0 {
					return nil, fmt.Errorf("Invalid salary found for employee id %s", employee.ID)
				}
				employee.Salary = salary
			}
		}
		employees = append(employees, employee)
	}

	// check if no valid data
	if len(employees) <= 0 {
		return nil, fmt.Errorf("No valid employee data found in csv")
	}
	return employees, nil
}
