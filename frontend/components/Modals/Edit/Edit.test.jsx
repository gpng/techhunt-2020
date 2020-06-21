import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithCustomAppContext } from '../../../utils/tests';
import Edit from './Edit';
import { closeModal, submitEdit } from '../../../actions/creators';

afterEach(cleanup);

const employee = { id: 'testid', name: 'testname', login: 'testlogin', salary: 3000 };

it('should render', () => {
  renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: null },
      },
    },
  });
});

it('should render confirm and cancel button', () => {
  const { queryByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: null },
      },
    },
  });
  expect(queryByTestId('button-confirm')).toBeTruthy();
  expect(queryByTestId('button-cancel')).toBeTruthy();
});

it('should dispatch close modal action on cancel', () => {
  const mockDispatch = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: mockDispatch,
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: null },
      },
    },
  });
  fireEvent.click(getByTestId('button-cancel'));
  expect(mockDispatch).toBeCalledTimes(1);
  expect(mockDispatch).toBeCalledWith(closeModal());
});

it('should dispatch delete submit on confirm', () => {
  const mockDispatchAsync = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: mockDispatchAsync,
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: null },
      },
    },
  });
  fireEvent.click(getByTestId('button-confirm'));
  expect(mockDispatchAsync).toBeCalledTimes(1);
  expect(mockDispatchAsync).toBeCalledWith(submitEdit(employee));
});

it('should show loading spinner when loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: true, success: false, error: null },
      },
    },
  });
  expect(getByTestId('spinner')).toBeTruthy();
});

it('should disable buttons when loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: true, success: false, error: null },
      },
    },
  });
  expect(getByTestId('button-cancel')).toBeDisabled();
  expect(getByTestId('button-confirm')).toBeDisabled();
});

it('should show success message on success and not loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: true, error: null },
      },
    },
  });
  expect(getByTestId('success')).toBeTruthy();
});

it('should show error message on error and not loading', () => {
  const errorMessage = 'Some error here';
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: errorMessage },
      },
    },
  });
  expect(getByTestId('error')).toHaveTextContent(errorMessage);
});

it('should initialise with employee details in put values', () => {
  const mockDispatch = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Edit />, {
    value: {
      dispatch: mockDispatch,
      dispatchAsync: () => {},
      state: {
        modal: { value: employee },
        edit: { loading: false, success: false, error: null },
      },
    },
  });
  expect(getByTestId('name').querySelector('input')).toHaveValue(employee.name);
  expect(getByTestId('login').querySelector('input')).toHaveValue(employee.login);
  expect(getByTestId('salary').querySelector('input')).toHaveValue(employee.salary);
});
