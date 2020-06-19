import React from 'react';
import { cleanup } from '@testing-library/react';
import Header from './Header';
import { renderWithContext } from '../../../utils/tests';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<Header />);
});

it('should match default snapshot', () => {
  const { asFragment } = renderWithContext(<Header />);
  expect(asFragment()).toMatchSnapshot();
});
