package models

import (
	"fmt"

	"github.com/google/uuid"
	c "github.com/gpng/techhunt-2020/backend/constants"
	u "github.com/gpng/techhunt-2020/backend/utils/utils"
	"github.com/jinzhu/gorm"
)

// Employee model
type Employee struct {
	ModelNoID
	ID     string  `json:"id" gorm:"primary_key;auto_increment:false" validate:"required"`
	Login  string  `json:"login" gorm:"unique;unique_index:uq_login;not null" validate:"required"`
	Name   string  `json:"name" gorm:"not null" validate:"required"`
	Salary float64 `json:"salary" gorm:"not null" validate:"required,number"`
}

// EmployeeUpdate params
type EmployeeUpdate struct {
	Login  string  `json:"login" validate:"required"`
	Name   string  `json:"name" validate:"required"`
	Salary float64 `json:"salary" gorm:"not null" validate:"required,number"`
}

// EmployeeSearch params for searching employees in db
type EmployeeSearch struct {
	MinSalary int
	MaxSalary int
	Offset    int
	Limit     int
	SortBy    string
	SortAsc   bool
}

// Possible values for sort column names
const (
	SortID     = "id"
	SortLogin  = "login"
	SortName   = "name"
	SortSalary = "salary"
)

// SortBy type to contain and check for valid sorting column names
type SortBy string

// Use SortBy type as enum
const (
	ID     SortBy = SortID
	Login  SortBy = SortLogin
	Name   SortBy = SortName
	Salary SortBy = SortSalary
)

// IsValid sort column name
func (sb SortBy) IsValid() error {
	switch sb {
	case ID, Login, Name, Salary:
		return nil
	}
	return fmt.Errorf("Invalid sort column")
}

// Save and upsert employee details
func (employee *Employee) Save(db *gorm.DB) error {
	err := db.Save(employee).Error
	if err != nil {
		u.LogError(err)
	}
	return err
}

// Delete emploee
func (employee *Employee) Delete(db *gorm.DB) error {
	// MUST have primary key (id) or everything will be deleted
	if employee.ID == "" {
		return fmt.Errorf(c.ErrStringDbDeleteNoPK)
	}
	err := db.Unscoped().Delete(employee).Error
	if err != nil {
		u.LogError(err)
	}
	return err
}

// GetEmployeeByID from db
func GetEmployeeByID(db *gorm.DB, id string) (Employee, error) {
	employee := Employee{}
	err := db.Where("id = ?", id).First(&employee).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		u.LogError(err)
	}
	return employee, err
}

// GetEmployeesByLogin from db
func GetEmployeesByLogin(db *gorm.DB, logins []string) ([]Employee, error) {
	employees := []Employee{}
	err := db.Where("login in (?)", logins).Find(&employees).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		u.LogError(err)
		return nil, err
	}
	return employees, nil
}

// BulkUpsertEmployees in a db transaction
func BulkUpsertEmployees(db *gorm.DB, employees []Employee) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// lookup every login to see if there are duplicates
		logins := []string{}
		// count each new logins, if there are duplicated new logins then it cannot be resolved
		loginsMap := map[string]string{}
		for _, employee := range employees {
			if _, ok := loginsMap[employee.Login]; ok {
				return fmt.Errorf(c.ErrStringDbDuplicateEmployeeLogin)
			}
			loginsMap[employee.Login] = employee.ID
			logins = append(logins, employee.Login)
		}

		// the target employees that will have their logins replaced
		toBeReplaced, err := GetEmployeesByLogin(db, logins)
		if err != nil {
			return err
		}

		// update all target employees with uuid logins, to prevent collisions
		for _, employee := range toBeReplaced {
			temp := employee
			temp.Login = uuid.New().String()
			if err := temp.Save(tx); err != nil {
				u.LogError(err)
				return err
			}
		}

		// now we can update all the affected employees
		for _, employee := range employees {
			if err := employee.Save(tx); err != nil {
				u.LogError(err)
				return err
			}
		}

		return nil
	})
}

// Search employees from db according to supplied params
func (params *EmployeeSearch) Search(db *gorm.DB) ([]Employee, error) {
	sortOrder := "DESC"
	if params.SortAsc {
		sortOrder = "ASC"
	}
	employees := []Employee{}
	err := db.Limit(params.Limit).
		Offset(params.Offset).
		Order(fmt.Sprintf("%s %s", params.SortBy, sortOrder)).
		Where(fmt.Sprintf("salary BETWEEN %d and %d", params.MinSalary, params.MaxSalary)).
		Find(&employees).
		Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		u.LogError(err)
	}
	return employees, err
}
