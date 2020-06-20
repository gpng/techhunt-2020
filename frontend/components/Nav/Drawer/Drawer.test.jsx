import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import Drawer from './Drawer';
import { renderWithContext, renderWithCustomAppContext } from '../../../utils/tests';
import { openModal } from '../../../actions/creators';
import { MODALS } from '../../../constants';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<Drawer />);
});

// test if correct classname is added
it('should match default snapshot', () => {
  const { asFragment } = renderWithContext(<Drawer />);
  expect(asFragment()).toMatchSnapshot();
});

it('should dispatch open upload action on button click', () => {
  const mockDispatch = jest.fn();
  const { getByTestId } = renderWithCustomAppContext(<Drawer />, {
    value: { dispatch: mockDispatch },
  });
  fireEvent.click(getByTestId('button-upload'));
  expect(mockDispatch).toHaveBeenCalledTimes(1);
  expect(mockDispatch).toHaveBeenCalledWith(openModal(MODALS.UPLOAD_CSV));
});
