package usersvc_test

import (
	"fmt"
	"net/url"
	"testing"

	"github.com/google/go-cmp/cmp"
	c "github.com/gpng/techhunt-2020/backend/constants"
	"github.com/gpng/techhunt-2020/backend/models"
	"github.com/gpng/techhunt-2020/backend/services/usersvc"
)

func TestGetSearchParams(t *testing.T) {
	testCases := []struct {
		description    string
		params         url.Values
		expectedResult models.EmployeeSearch
		expectedError  error
	}{
		{
			description: "All valid params",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{"-salary"},
			},
			expectedResult: models.EmployeeSearch{
				MinSalary: 0,
				MaxSalary: 4000,
				Offset:    0,
				Limit:     30,
				SortBy:    models.SortSalary,
				SortAsc:   false,
			},
		},
		{
			description: "Invalid min salary",
			params: url.Values{
				"minSalary": []string{"-1"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidMinSalary),
		},
		{
			description: "Invalid max salary",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"a"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidMaxSalary),
		},
		{
			description: "Invalid max salary lower than min",
			params: url.Values{
				"minSalary": []string{"100"},
				"maxSalary": []string{"2"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidMaxSalary),
		},
		{
			description: "Invalid offset",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"z"},
				"limit":     []string{"30"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidOffset),
		},
		{
			description: "Invalid limit",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"0"},
				"limit":     []string{"-2"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidLimit),
		},
		{
			description: "Invalid sort order",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{".name"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidSort),
		},
		{
			description: "Invalid sort name",
			params: url.Values{
				"minSalary": []string{"0"},
				"maxSalary": []string{"4000"},
				"offset":    []string{"0"},
				"limit":     []string{"30"},
				"sort":      []string{"-salaries"},
			},
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidSort),
		},
	}

	for _, tc := range testCases {
		result, err := usersvc.GetSearchParams(tc.params)
		if tc.expectedError != nil {
			if err == nil || err.Error() != tc.expectedError.Error() {
				t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
			}
		} else if err != nil {
			t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
		} else if !cmp.Equal(tc.expectedResult, result) {
			t.Errorf("%v failed - expected %v but got %v instead", tc.description, tc.expectedResult, result)
		}
	}
}

func TestParseSort(t *testing.T) {
	testCases := []struct {
		description     string
		sortString      string
		expectedError   error
		expectedSortBy  string
		expectedSortAsc bool
	}{
		{
			description:     "Valid sort string",
			sortString:      "+name",
			expectedError:   nil,
			expectedSortBy:  models.SortName,
			expectedSortAsc: true,
		},
		{
			description:     "Valid sort desc",
			sortString:      "-login",
			expectedSortBy:  models.SortLogin,
			expectedSortAsc: false,
		},
		{
			description:   "Invalid sort asc",
			sortString:    ".salary",
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidSort),
		},
		{
			description:   "Invalid sort by",
			sortString:    "+names",
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidSort),
		},
		{
			description:   "Invalid empty string",
			sortString:    "",
			expectedError: fmt.Errorf(c.ErrStringSearchInvalidSort),
		},
	}

	for _, tc := range testCases {
		sortBy, sortAsc, err := usersvc.ParseSort(tc.sortString)
		if tc.expectedError != nil {
			if err == nil || err.Error() != tc.expectedError.Error() {
				t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
			}
		} else if err != nil {
			t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
		} else if tc.expectedSortBy != sortBy {
			t.Errorf("%v failed - expected sort by %v but got sort by %v instead", tc.description, tc.expectedSortBy, sortBy)
		} else if tc.expectedSortAsc != sortAsc {
			t.Errorf("%v failed - expected sort asc %v but got sort asc %v instead", tc.description, tc.expectedSortAsc, sortAsc)
		}
	}
}

func TestParseCSVToEmployees(t *testing.T) {
	testCases := []struct {
		description       string
		csvString         string
		expectedEmployees []models.Employee
		expectedError     error
	}{
		{
			description: "Valid csv",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00
e0002,rwesley,Ron Weasley,1400.50
			`,
			expectedEmployees: []models.Employee{
				{
					ID:     "e0001",
					Login:  "hpotter",
					Name:   "Harry Potter",
					Salary: 1000,
				},
				{
					ID:     "e0002",
					Login:  "rwesley",
					Name:   "Ron Weasley",
					Salary: 1400.5,
				},
			},
		}, {
			description: "Valid csv with comments",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00
# yet another weasley
e0002,rweasley,Ron Weasley,1524.50
			`,
			expectedEmployees: []models.Employee{
				{
					ID:     "e0001",
					Login:  "hpotter",
					Name:   "Harry Potter",
					Salary: 1000,
				},
				{
					ID:     "e0002",
					Login:  "rweasley",
					Name:   "Ron Weasley",
					Salary: 1524.5,
				},
			},
		}, {
			description: "Invalid missing column",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00
e0002,rweasley,,1524.50
			`,
			expectedError: fmt.Errorf(c.ErrStringCsvIncorrectColumns),
		}, {
			description:   "Invalid empty file",
			csvString:     ``,
			expectedError: fmt.Errorf(c.ErrStringCsvNoData),
		}, {
			description: "Invalid too many columns",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00,hponlyfans,
e0002,rweasley,Ron Weasley,1524.50
			`,
			expectedError: fmt.Errorf(c.ErrStringCsvIncorrectColumns),
		}, {
			description: "Invalid negative salary",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00
e0002,rweasley,Ron Weasley,-1524.50
			`,
			expectedError: fmt.Errorf(c.ErrStringCsvInvalidSalary),
		}, {
			description: "Invalid not a number",
			csvString: `
id,username,name,salary
e0001,hpotter,Harry Potter,1000.00
e0002,rweasley,Ron Weasley,ten thousand
			`,
			expectedError: fmt.Errorf(c.ErrStringCsvInvalidSalary),
		},
	}
	for _, tc := range testCases {
		employees, err := usersvc.ParseCSVToEmployees(tc.csvString)
		if tc.expectedError != nil {
			if err == nil || err.Error() != tc.expectedError.Error() {
				t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
			}
		} else if err != nil {
			t.Errorf("%v failed - expected error %v but got error %v instead", tc.description, tc.expectedError, err)
		} else if !cmp.Equal(tc.expectedEmployees, employees) {
			t.Errorf("%v failed - expected %v but got %v instead", tc.description, tc.expectedEmployees, employees)
		}
	}
}
