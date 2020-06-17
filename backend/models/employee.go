package models

import (
	"fmt"

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

// EmployeeSearch params for searching employees in db
type EmployeeSearch struct {
	MinSalary int
	MaxSalary int
	Offset    int
	Limit     int
	SortBy    string
	SortAsc   bool
}

// Save and upsert employee details
func (employee *Employee) Save(db *gorm.DB) error {
	err := db.Save(employee).Error
	if err != nil {
		u.LogError(err)
	}
	return err
}

// SortBy type to contain and check for valid sorting column names
type SortBy string

// Possible values for sort column names
const (
	ID     SortBy = "id"
	Login  SortBy = "login"
	Name   SortBy = "name"
	Salary SortBy = "salary"
)

// IsValid sort column name
func (sb SortBy) IsValid() error {
	switch sb {
	case ID, Login, Name, Salary:
		return nil
	}
	return fmt.Errorf("Invalid sort column")
}

// BulkUpsertEmployees in a db transaction
func BulkUpsertEmployees(db *gorm.DB, employees []Employee) error {
	return db.Transaction(func(tx *gorm.DB) error {
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
		Find(&employees).
		Where("salary BETWEEN ? and ?", params.MinSalary, params.MaxSalary).
		Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		u.LogError(err)
	}
	return employees, err
}
