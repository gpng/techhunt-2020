package usersvc

import (
	"bytes"
	"fmt"
	"io"
	"net/http"

	"github.com/go-chi/chi"
	c "github.com/gpng/techhunt-2020/backend/constants"
	"github.com/gpng/techhunt-2020/backend/models"
	u "github.com/gpng/techhunt-2020/backend/utils/utils"
	"github.com/jinzhu/gorm"
)

// handleSearch godoc
// @Summary Search employee data
// @Description Search employee data
// @Tags employees
// @Produce  json
// @Param minSalary query number true "Minimum salary"
// @Param maxSalary query number true "Maximum salary"
// @Param offset query number true "Offset results" minimum(0)
// @Param limit query number true "Number of results" minimum(1)
// @Param sort query string true "Sort by parameter, etc +name, -login" Enums(+name, -name, +login, -login, +id, -id, +salary, -salary)
// @Router /users [get]
func (s *Service) handleSearch() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		searchParams, err := GetSearchParams(r.URL.Query())
		if err != nil {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidParam, err, err.Error()),
			)
			return
		}

		employees, err := searchParams.Search(s.db)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			s.render.RespondWithStatus(w, r, http.StatusInternalServerError,
				s.render.ErrorMessage(c.ErrDbLookupFailed, err, "Failed to lookup employees"),
			)
		}

		s.render.Respond(w, r, s.render.DataMessage(employees, true, "Search success!"))
	}
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
		// check if another upload is taking place
		if s.isUploading {
			s.render.RespondWithStatus(w, r, http.StatusConflict,
				s.render.ErrorMessage(c.ErrServerBusy, fmt.Errorf(c.ErrStringsCsvUploading), c.ErrStringsCsvUploading),
			)
			return
		}

		// set isUploading status to true to prevent other uploads
		s.isUploading = true

		file, _, err := r.FormFile("file")
		defer file.Close()
		if err != nil {
			u.LogError(err)
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrInvalidFile, err, "Invalid file"),
			)
			s.isUploading = false
			return
		}

		var buffer bytes.Buffer
		io.Copy(&buffer, file)

		employees, err := ParseCSVToEmployees(buffer.String())
		if err != nil {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrCsvInvalid, err, err.Error()),
			)
			s.isUploading = false
			return
		}

		err = models.BulkUpsertEmployees(s.db, employees)
		if err != nil {
			message := "Failed to update employees"
			if err.Error() == c.ErrStringDbDuplicateEmployeeLogin {
				message = "Duplicate login detected"
			}
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrDbUpdateFailed, err, message),
			)
			s.isUploading = false
			return
		}

		s.isUploading = false
		s.render.Respond(w, r, s.render.Message(true, "Employees updated successfully"))
	}
}

// handleDeleteEmployee godoc
// @Summary Delete employee
// @Description Delete employee from db by employee id
// @Tags employees
// @Produce  json
// @Param employeeID path string true "Employee ID"
// @Router /users/{employeeID} [delete]
func (s *Service) handleDeleteEmployee() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		employeeID := chi.URLParam(r, "employeeID")
		if employeeID == "" {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrMissingParam, fmt.Errorf("Employee ID Required"), "Employee ID required"),
			)
			return
		}

		employee := models.Employee{}
		employee.ID = employeeID

		if err := employee.Delete(s.db); err != nil {
			s.render.RespondWithStatus(w, r, http.StatusBadRequest,
				s.render.ErrorMessage(c.ErrDbDeleteFailed, err, "Employee Delete failed"),
			)
			return
		}

		s.render.Respond(w, r, s.render.Message(true, "Employee deleted successfully"))
	}
}
