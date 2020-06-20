// test only complex sql queries to ensure that the generated query matches what we need
// unecessary for simple update/insert

package models_test

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	c "github.com/gpng/techhunt-2020/backend/constants"
	"github.com/gpng/techhunt-2020/backend/models"
	"github.com/jinzhu/gorm"
)

func setupMockDb(t *testing.T) (*gorm.DB, sqlmock.Sqlmock, error) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Failed to setup mock sql conn with err %v", err)
		return nil, nil, err
	}

	gormDb, err := gorm.Open("postgres", db)
	if err != nil {
		t.Fatalf("Failed to establish gorm db connection with mock sql with error %v", err)
		return nil, nil, err
	}

	return gormDb, mock, nil
}

func TestEmployeeDelete(t *testing.T) {
	db, _, err := setupMockDb(t)
	if err != nil {
		return
	}
	defer db.Close()
	employee := models.Employee{
		ID: "",
	}
	if err := employee.Delete(db); err == nil || err.Error() != c.ErrStringDbDeleteNoPK {
		t.Errorf("No primary key: Expected error %v but got %v instead", fmt.Errorf(c.ErrStringDbDeleteNoPK), err)
	}
}

func TestEmployeeSearch(t *testing.T) {
	db, mock, err := setupMockDb(t)
	if err != nil {
		return
	}
	defer db.Close()

	rows := mock.
		NewRows([]string{"id", "login", "name", "salary"}).
		AddRow("e0001", "hpotter", "harry potter", "3000")

	searchQuery := `
		SELECT * FROM "employees"
		WHERE "employees"."deleted_at" IS NULL 
			AND ((salary BETWEEN %d and %d))
		ORDER BY %s %s
		LIMIT %d
		OFFSET %d
	`

	testCases := []models.EmployeeSearch{
		{
			MinSalary: 0,
			MaxSalary: 5000,
			Offset:    0,
			Limit:     30,
			SortBy:    models.SortID,
			SortAsc:   true,
		}, {
			MinSalary: 5000,
			MaxSalary: 10000,
			Offset:    5,
			Limit:     30,
			SortBy:    models.SortLogin,
			SortAsc:   false,
		},
	}

	for _, tc := range testCases {
		order := "ASC"
		if !tc.SortAsc {
			order = "DESC"
		}
		mock.ExpectQuery(regexp.QuoteMeta(fmt.Sprintf(
			searchQuery,
			tc.MinSalary,
			tc.MaxSalary,
			tc.SortBy,
			order,
			tc.Limit,
			tc.Offset,
		))).WillReturnRows(rows)

		_, err = tc.Search(db)
		if err != nil {
			t.Errorf("Expected no error but got %v", err)
		}
	}
}
