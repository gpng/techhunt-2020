import React from 'react';
import { cleanup } from '@testing-library/react';
import Drawer from './Drawer';
import { renderWithContext } from '../../../utils/tests';

afterEach(cleanup);

it('should render', () => {
  renderWithContext(<Drawer />);
});

// test if correct classname is added
it('should match default snapshot', () => {
  const { asFragment } = renderWithContext(<Drawer />);
  expect(asFragment()).toMatchSnapshot();
});
