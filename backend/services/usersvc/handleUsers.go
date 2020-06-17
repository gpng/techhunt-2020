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
)

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
		data := strings.TrimSpace(buffer.String())

		rowsString := strings.Split(data, "\n")

		// check if no data
		if len(rowsString) <= 0 {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrCsvInvalid, err, "No data found in csv"),
			)
			return
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
				s.render.RespondWithStatus(w, r, http.StatusBadRequest,
					s.render.ErrorMessage(c.ErrCsvInvalid, err, "Incorrect number of columns found"),
				)
				return
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
						s.render.RespondWithStatus(w, r, http.StatusBadRequest,
							s.render.ErrorMessage(c.ErrCsvInvalid, err, fmt.Sprintf("Invalid salary found for employee id %s", employee.ID)),
						)
						return
					}
					employee.Salary = salary
				}
			}
			employees = append(employees, employee)
		}

		// check if no valid data
		if len(employees) <= 0 {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrCsvInvalid, err, "No valid data found in csv"),
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
