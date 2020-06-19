import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithContext, renderWithCustomAppContext } from '../../utils/tests';
import ModalContainer from './ModalContainer';
import { MODALS } from '../../constants';

afterEach(cleanup);

it('should render null by default', () => {
  const { queryByTestId } = renderWithContext(<ModalContainer />);
  expect(queryByTestId('modal-container-root')).toBeNull();
});

it('should have modal content with valid openModal', () => {
  const { getByTestId } = renderWithCustomAppContext(<ModalContainer />, {
    value: {
      state: {
        openModal: MODALS.UPLOAD_CSV,
        upload: { loading: false, success: false, error: null },
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
        openModal: MODALS.UPLOAD_CSV,
        upload: { loading: false, success: false, error: null },
      },
      dispatch: () => {},
      dispatchAsync: () => {},
    },
  });
  expect(getByTestId('upload-root')).toBeTruthy();
});
