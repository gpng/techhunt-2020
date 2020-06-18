package models_test

import (
	"fmt"
	"log"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
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

	searchParams := models.EmployeeSearch{
		MinSalary: 0,
		MaxSalary: 5000,
		Offset:    0,
		Limit:     30,
		SortBy:    models.SortID,
		SortAsc:   true,
	}
	order := "ASC"
	if !searchParams.SortAsc {
		order = "DESC"
	}
	mock.ExpectQuery(regexp.QuoteMeta(fmt.Sprintf(
		searchQuery,
		searchParams.MinSalary,
		searchParams.MaxSalary,
		searchParams.SortBy,
		order,
		searchParams.Limit,
		searchParams.Offset,
	))).WillReturnRows(rows)

	res, err := searchParams.Search(db)
	if err != nil {
		t.Errorf("Expected no error but got %v", err)
	}
	log.Println(res)
}
