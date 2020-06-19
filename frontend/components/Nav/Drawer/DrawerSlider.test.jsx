import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import DrawerSlider from './DrawerSlider';
import { renderWithContext } from '../../../utils/tests';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<DrawerSlider />);
});

it('should match default snapshot', () => {
  const { asFragment } = renderWithContext(<DrawerSlider />);
  expect(asFragment()).toMatchSnapshot();
});

it('should match open snapshot', () => {
  const { asFragment, getByTestId } = renderWithContext(<DrawerSlider />);
  fireEvent.click(getByTestId('button-menu'));
  expect(asFragment()).toMatchSnapshot();
});

it('should match default snapshot after close', () => {
  const { asFragment, getByTestId } = renderWithContext(<DrawerSlider />);
  fireEvent.click(getByTestId('button-menu'));
  fireEvent.click(getByTestId('button-menu'));
  expect(asFragment()).toMatchSnapshot('should match default snapshot');
});
