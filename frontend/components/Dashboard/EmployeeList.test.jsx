/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
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
  onClickDelete: () => {},
  onClickEdit: () => {},
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

it('it should have a delete button for each employee', () => {
  const employees = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  const { queryByTestId } = render(<EmployeeList {...requiredProps} employees={employees} />);
  employees.forEach((x) => {
    expect(queryByTestId(`button-delete-wrapper-${x.id}`).querySelector('button')).toBeTruthy();
  });
});

it('it should fire onClickDelete with correct id for each employee', () => {
  const employees = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  const mockOnClickDelete = jest.fn();
  const { getByTestId } = render(
    <EmployeeList {...requiredProps} employees={employees} onClickDelete={mockOnClickDelete} />,
  );
  employees.forEach((x) => {
    fireEvent.click(getByTestId(`button-delete-wrapper-${x.id}`).querySelector('button'));
    expect(mockOnClickDelete).toBeCalledWith(x.id);
  });
  expect(mockOnClickDelete).toBeCalledTimes(employees.length);
});

it('it should have a edit button for each employee', () => {
  const employees = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  const { queryByTestId } = render(<EmployeeList {...requiredProps} employees={employees} />);
  employees.forEach((x) => {
    expect(queryByTestId(`button-edit-wrapper-${x.id}`).querySelector('button')).toBeTruthy();
  });
});

it('it should fire onClickEdit with details for each employee', () => {
  const employees = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ];
  const mockOnClickEdit = jest.fn();
  const { getByTestId } = render(
    <EmployeeList {...requiredProps} employees={employees} onClickEdit={mockOnClickEdit} />,
  );
  employees.forEach((x) => {
    fireEvent.click(getByTestId(`button-edit-wrapper-${x.id}`).querySelector('button'));
    expect(mockOnClickEdit).toBeCalledWith(x);
  });
  expect(mockOnClickEdit).toBeCalledTimes(employees.length);
});
