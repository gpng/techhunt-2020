package usersvc

import (
	"fmt"
	"net/url"
	"strconv"
	"strings"

	c "github.com/gpng/techhunt-2020/backend/constants"
	"github.com/gpng/techhunt-2020/backend/models"
)

// GetSearchParams from request query and validate
func GetSearchParams(query url.Values) (models.EmployeeSearch, error) {
	queryMinSalary := query.Get("minSalary")
	queryMaxSalary := query.Get("maxSalary")
	queryOffset := query.Get("offset")
	queryLimit := query.Get("limit")
	querySort := query.Get("sort")

	searchParams := models.EmployeeSearch{}

	// check for missing params
	if queryMinSalary == "" || queryMaxSalary == "" || queryOffset == "" || queryLimit == "" || querySort == "" {
		return searchParams, fmt.Errorf(c.ErrStringSearchMissingParams)
	}

	// validate params
	minSalary, err := strconv.Atoi(queryMinSalary)
	if err != nil || minSalary < 0 {
		return searchParams, fmt.Errorf(c.ErrStringSearchInvalidMinSalary)
	}
	searchParams.MinSalary = minSalary

	maxSalary, err := strconv.Atoi(queryMaxSalary)
	if err != nil || maxSalary < 0 || maxSalary < minSalary {
		return searchParams, fmt.Errorf(c.ErrStringSearchInvalidMaxSalary)
	}
	searchParams.MaxSalary = maxSalary

	offset, err := strconv.Atoi(queryOffset)
	if err != nil || offset < 0 {
		return searchParams, fmt.Errorf(c.ErrStringSearchInvalidOffset)
	}
	searchParams.Offset = offset

	limit, err := strconv.Atoi(queryLimit)
	if err != nil || limit < 1 || limit > 30 {
		return searchParams, fmt.Errorf(c.ErrStringSearchInvalidLimit)
	}
	searchParams.Limit = limit

	sortBy, sortAsc, err := ParseSort(querySort)
	if err != nil {
		return searchParams, err
	}

	searchParams.SortBy = sortBy
	searchParams.SortAsc = sortAsc

	return searchParams, nil
}

// ParseSort from query string into sort by param and order
func ParseSort(sortQuery string) (string, bool, error) {
	// cannot be less than 1 char as the first character must already be + or -
	if len(sortQuery) <= 1 {
		return "", true, fmt.Errorf(c.ErrStringSearchInvalidSort)
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
		return "", true, fmt.Errorf(c.ErrStringSearchInvalidSort)
	}

	sortByString := sortQuery[1:]
	sortBy := models.SortBy(sortByString)
	if err := sortBy.IsValid(); err != nil {
		return "", true, fmt.Errorf(c.ErrStringSearchInvalidSort)
	}
	return sortByString, sortAsc, nil
}

// ParseCSVToEmployees parses a csv string into a slice of employees
func ParseCSVToEmployees(csvString string) ([]models.Employee, error) {
	data := strings.TrimSpace(csvString)

	rowsString := strings.Split(data, "\n")

	// check if no data
	if len(rowsString) <= 0 {
		return nil, fmt.Errorf(c.ErrStringCsvNoData)
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
			return nil, fmt.Errorf(c.ErrStringCsvIncorrectColumns)
		}
		employee := models.Employee{}
		for i, val := range cols {
			if val == "" {
				return nil, fmt.Errorf(c.ErrStringCsvIncorrectColumns)
			}
			switch i {
			case 0: // idr
				employee.ID = val
			case 1: // login
				employee.Login = val
			case 2: // name
				employee.Name = val
			case 3: // salary
				salary, err := strconv.ParseFloat(val, 64)
				if err != nil || !IsValidSalary(salary) {
					return nil, fmt.Errorf(c.ErrStringCsvInvalidSalary)
				}
				employee.Salary = salary
			}
		}
		employees = append(employees, employee)
	}

	// check if no valid data
	if len(employees) <= 0 {
		return nil, fmt.Errorf(c.ErrStringCsvNoData)
	}
	return employees, nil
}

// IsValidSalary checks if salary is a positive number with at most 2 decimals
func IsValidSalary(salary float64) bool {
	return salary >= 0
}
