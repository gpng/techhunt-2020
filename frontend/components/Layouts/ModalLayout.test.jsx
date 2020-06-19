import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import ModalLayout from './ModalLayout';
import { renderWithContext, renderWithCustomAppContext } from '../../utils/tests';
import { APP_ACTIONS } from '../Context/App/AppContext';

afterEach(cleanup);

it('should render with expected title and children', () => {
  const title = 'test title';
  const Children = () => <div data-testid="child">children</div>;
  const { getByTestId, queryByTestId } = renderWithContext(
    <ModalLayout title={title}>
      <Children />
    </ModalLayout>,
  );
  expect(getByTestId('title')).toHaveTextContent(title);
  expect(queryByTestId('child')).toBeTruthy();
});

it('should dispatch a close action on close button click', () => {
  const title = 'test title';
  const Children = () => <div data-testid="child">children</div>;
  const mockDispatch = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(
    <ModalLayout title={title}>
      <Children />
    </ModalLayout>,
    {
      value: { dispatch: mockDispatch },
    },
  );
  fireEvent.click(getByTestId('button-close'));
  expect(mockDispatch).toBeCalledTimes(1);
  expect(mockDispatch).toBeCalledWith({
    type: APP_ACTIONS.MODAL_CLOSE,
  });
});
