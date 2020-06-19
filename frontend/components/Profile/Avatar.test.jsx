import { render, cleanup } from '@testing-library/react';
import Avatar from './Avatar';

afterEach(cleanup);

it('should render', () => {
  render(<Avatar />);
});

it('should match default snapshot', () => {
  const { asFragment } = render(<Avatar />);
  expect(asFragment(<Avatar />)).toMatchSnapshot();
});

it('should match snapshot with width', () => {
  const props = {
    width: '10rem',
  };
  const { asFragment } = render(<Avatar width={props.width} />);
  expect(asFragment()).toMatchSnapshot();
});
