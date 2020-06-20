/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import EmployeeList from './EmployeeList';

afterEach(cleanup);

const requiredProps = {
  actionLabel: 'test',
  columns: [
    {
      key: 'id',
      label: 'ID',
      accessor: 'id',
    },
    {
      key: 'name',
      label: 'Name',
      accessor: 'name',
    },
  ],
};

it('should render', () => {
  render(<EmployeeList {...requiredProps} />);
});

it('should show loading spinner when loading', () => {
  const { queryByTestId } = render(<EmployeeList {...requiredProps} loading />);
  expect(queryByTestId('spinner')).toBeTruthy();
});

it('should show error message on error and not loading', () => {
  const errorMessage = 'Some error here';
  const { getByTestId } = render(<EmployeeList {...requiredProps} error={errorMessage} />);
  expect(getByTestId('error')).toHaveTextContent(errorMessage);
});

it('should show no results message when not loaded and no employees', () => {
  const { queryByTestId } = render(<EmployeeList {...requiredProps} />);
  expect(queryByTestId('no-results')).toBeTruthy();
});

it('should have correct number of columns', () => {
  const { getAllByTestId } = render(<EmployeeList {...requiredProps} />);
  expect(getAllByTestId('header-columns')).toHaveLength(requiredProps.columns.length);
});

it('should have correct number of employees', () => {
  const employees = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  const { getAllByTestId } = render(<EmployeeList {...requiredProps} employees={employees} />);
  expect(getAllByTestId('employee-rows')).toHaveLength(employees.length);
  expect(getAllByTestId('employee-cells')).toHaveLength(
    employees.length * requiredProps.columns.length,
  );
});
