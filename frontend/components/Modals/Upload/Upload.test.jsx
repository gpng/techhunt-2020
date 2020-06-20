import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithContext, renderWithCustomAppContext } from '../../../utils/tests';
import Upload from './Upload';
import { submitUploadCSV } from '../../../actions/creators';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<Upload />);
});

it('should show input when not loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Upload />, {
    value: {
      dispatchAsync: () => {},
      state: {
        upload: { loading: false, success: false, error: null },
      },
    },
  });
  expect(getByTestId('input-file')).toBeTruthy();
});

it('should show loading spinner when loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Upload />, {
    value: {
      dispatchAsync: () => {},
      state: {
        upload: { loading: true, success: false, error: null },
      },
    },
  });
  expect(getByTestId('spinner')).toBeTruthy();
});

it('should show success message on success and not loading', () => {
  const { getByTestId } = renderWithCustomAppContext(<Upload />, {
    value: {
      dispatchAsync: () => {},
      state: {
        upload: { loading: false, success: true, error: null },
      },
    },
  });
  expect(getByTestId('success')).toBeTruthy();
});

it('should show error message on error and not loading', () => {
  const errorMessage = 'Some error here';
  const { getByTestId } = renderWithCustomAppContext(<Upload />, {
    value: {
      dispatchAsync: () => {},
      state: {
        upload: { loading: false, success: false, error: errorMessage },
      },
    },
  });
  expect(getByTestId('error')).toHaveTextContent(errorMessage);
});

it('should dispatch file upload action on file input', () => {
  const file = new File(['test'], 'test.csv', { type: 'text/csv' });
  const mockDispatchAsync = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Upload />, {
    value: {
      dispatchAsync: mockDispatchAsync,
      state: {
        upload: { loading: false, success: false, error: null },
      },
    },
  });
  const input = getByTestId('input-file');
  Object.defineProperty(input, 'files', {
    value: [file],
  });

  fireEvent.change(input);

  expect(mockDispatchAsync).toBeCalledTimes(1);
  expect(mockDispatchAsync).toBeCalledWith(submitUploadCSV(file));
});
