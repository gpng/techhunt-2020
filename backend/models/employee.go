package models

import (
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

// Save and upsert employee details
func (employee *Employee) Save(db *gorm.DB) error {
	err := db.Save(employee).Error
	if err != nil {
		u.LogError(err)
	}
	return err
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

// GetAllEmployees from db
func GetAllEmployees(db *gorm.DB) ([]Employee, error) {
	employees := []Employee{}
	err := db.Find(&employees).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		u.LogError(err)
	}
	return employees, err
}
