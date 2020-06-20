import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithContext, renderWithCustomAppContext } from '../../utils/tests';
import ModalContainer from './ModalContainer';
import { MODALS } from '../../constants';

afterEach(cleanup);

const defaultAppState = {
  modal: {
    name: null,
    value: null,
  },
  upload: { loading: false, success: false, error: null },
  delete: { loading: false, success: false, error: null },
};

it('should render null by default', () => {
  const { queryByTestId } = renderWithContext(<ModalContainer />);
  expect(queryByTestId('modal-container-root')).toBeNull();
});

it('should have modal content with valid openModal', () => {
  const { getByTestId } = renderWithCustomAppContext(<ModalContainer />, {
    value: {
      state: {
        ...defaultAppState,
        modal: { name: MODALS.UPLOAD_CSV },
      },
      dispatch: () => {},
      dispatchAsync: () => {},
    },
  });
  expect(getByTestId('modal-content')).not.toBeEmptyDOMElement();
});

it('should have modal content with Upload component', () => {
  const { getByTestId } = renderWithCustomAppContext(<ModalContainer />, {
    value: {
      state: {
        ...defaultAppState,
        modal: { name: MODALS.UPLOAD_CSV },
      },
      dispatch: () => {},
      dispatchAsync: () => {},
    },
  });
  expect(getByTestId('upload-root')).toBeTruthy();
});

it('should have modal content with Delete component', () => {
  const { getByTestId } = renderWithCustomAppContext(<ModalContainer />, {
    value: {
      state: {
        ...defaultAppState,
        modal: { name: MODALS.DELETE, value: 'testid' },
      },
      dispatch: () => {},
      dispatchAsync: () => {},
    },
  });
  expect(getByTestId('delete-root')).toBeTruthy();
});
