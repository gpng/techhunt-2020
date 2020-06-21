import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithCustomAppContext } from '../../utils/tests';
import Dashboard from './Dashboard';
import { SEARCH, MODALS } from '../../constants';
import { submitSearch, openModal } from '../../actions/creators';

afterEach(cleanup);

const defaultPayload = {
  minSalary: SEARCH.DEFAULTS.MIN_SALARY,
  maxSalary: SEARCH.DEFAULTS.MAX_SALARY,
  sort: SEARCH.DEFAULTS.SORT,
  offset: 0,
  limit: SEARCH.PAGE_SIZE,
};

const defaultAppState = {
  search: { employees: [], loading: false, success: false, error: null },
};

it('should render', () => {
  renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatchAsync: () => {},
      state: defaultAppState,
    },
  });
});

it('should dispatch search action on mount', () => {
  const mockDispatchAsync = jest.fn();
  renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatchAsync: mockDispatchAsync,
      state: {
        search: {
          employees: [],
        },
      },
    },
  });
  expect(mockDispatchAsync).toBeCalledTimes(1);
  expect(mockDispatchAsync).toBeCalledWith(
    submitSearch(
      defaultPayload.minSalary,
      defaultPayload.maxSalary,
      defaultPayload.sort,
      defaultPayload.offset,
      defaultPayload.limit,
    ),
  );
});

it('should dispatch search action on button click', () => {
  const mockDispatchAsync = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatchAsync: mockDispatchAsync,
      state: defaultAppState,
    },
  });
  fireEvent.click(getByTestId('button-search'));
  expect(mockDispatchAsync).toBeCalledTimes(2);
  expect(mockDispatchAsync).toBeCalledWith(
    submitSearch(
      defaultPayload.minSalary,
      defaultPayload.maxSalary,
      defaultPayload.sort,
      defaultPayload.offset,
      defaultPayload.limit,
    ),
  );
});

it('should dispatch search action on sort change', () => {
  const mockDispatchAsync = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatchAsync: mockDispatchAsync,
      state: defaultAppState,
    },
  });
  const sort = '-login';
  fireEvent.change(getByTestId('select-sort'), {
    target: { value: sort },
  });
  expect(mockDispatchAsync).toBeCalledTimes(2);
  expect(mockDispatchAsync).toBeCalledWith(
    submitSearch(
      defaultPayload.minSalary,
      defaultPayload.maxSalary,
      sort,
      defaultPayload.offset,
      defaultPayload.limit,
    ),
  );
});

it('should dispatch open delete modal on delete click', () => {
  const mockDispatch = jest.fn();
  const employees = [
    {
      id: 'testid1',
    },
    { id: 'testid2' },
  ];
  const { getByTestId } = renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatch: mockDispatch,
      dispatchAsync: () => {},
      state: { search: { employees, loading: false, success: false, error: null } },
    },
  });
  employees.forEach((x) => {
    fireEvent.click(getByTestId(`button-delete-wrapper-${x.id}`).querySelector('button'));
    expect(mockDispatch).toBeCalledWith(openModal(MODALS.DELETE, x.id));
  });
  expect(mockDispatch).toBeCalledTimes(employees.length);
});

it('should dispatch open edit modal on edit click', () => {
  const mockDispatch = jest.fn();
  const employees = [
    {
      id: 'testid1',
    },
    { id: 'testid2' },
  ];
  const { getByTestId } = renderWithCustomAppContext(<Dashboard />, {
    value: {
      dispatch: mockDispatch,
      dispatchAsync: () => {},
      state: { search: { employees, loading: false, success: false, error: null } },
    },
  });
  employees.forEach((x) => {
    fireEvent.click(getByTestId(`button-edit-wrapper-${x.id}`).querySelector('button'));
    expect(mockDispatch).toBeCalledWith(openModal(MODALS.EDIT, x));
  });
  expect(mockDispatch).toBeCalledTimes(employees.length);
});
