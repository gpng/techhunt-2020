import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithContext, renderWithCustomAppContext } from '../../../utils/tests';
import Delete from './Delete';
import { closeModal, submitDelete } from '../../../actions/creators';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<Delete />);
});

it('should render confirm and cancel button', () => {
  const { queryByTestId } = renderWithContext(<Delete />);
  expect(queryByTestId('button-confirm')).toBeTruthy();
  expect(queryByTestId('button-cancel')).toBeTruthy();
});

it('should show message when not loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: false, success: false, error: null },
      },
    },
  });
  expect(getByTestId('message')).toBeTruthy();
});

it('should dispatch close modal action on cancel', () => {
  const mockDispatch = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: mockDispatch,
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: false, success: false, error: null },
      },
    },
  });
  fireEvent.click(getByTestId('button-cancel'));
  expect(mockDispatch).toBeCalledTimes(1);
  expect(mockDispatch).toBeCalledWith(closeModal());
});

it('should dispatch delete submit on confirm', () => {
  const value = 'testid';
  const mockDispatchAsync = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: mockDispatchAsync,
      state: {
        modal: { value },
        delete: { loading: false, success: false, error: null },
      },
    },
  });
  fireEvent.click(getByTestId('button-confirm'));
  expect(mockDispatchAsync).toBeCalledTimes(1);
  expect(mockDispatchAsync).toBeCalledWith(submitDelete(value));
});

it('should show loading spinner when loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: true, success: false, error: null },
      },
    },
  });
  expect(getByTestId('spinner')).toBeTruthy();
});

it('should disable buttons when loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: true, success: false, error: null },
      },
    },
  });
  expect(getByTestId('button-cancel')).toBeDisabled();
  expect(getByTestId('button-confirm')).toBeDisabled();
});

it('should show success message on success and not loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: false, success: true, error: null },
      },
    },
  });
  expect(getByTestId('success')).toBeTruthy();
});

it('should show error message on error and not loading', () => {
  const errorMessage = 'Some error here';
  const { getByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: false, success: false, error: errorMessage },
      },
    },
  });
  expect(getByTestId('error')).toHaveTextContent(errorMessage);
});

it('should hide confirm button on success', () => {
  const { queryByTestId } = renderWithCustomAppContext(<Delete />, {
    value: {
      dispatch: () => {},
      dispatchAsync: () => {},
      state: {
        modal: { value: 'testid' },
        delete: { loading: false, success: true, error: null },
      },
    },
  });
  expect(queryByTestId('button-confirm')).toBeNull();
});
