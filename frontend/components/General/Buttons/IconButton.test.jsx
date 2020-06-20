import { render, cleanup, fireEvent } from '@testing-library/react';
import IconButton from './IconButton';

afterEach(cleanup);

it('should render with expected props', () => {
  const Icon = <div data-testid="icon" />;
  const { queryByTestId } = render(<IconButton onClick={() => {}} icon={Icon} />);
  expect(queryByTestId('icon')).toBeTruthy();
});

it('should fire onClick on button click', () => {
  const Icon = <div data-testid="icon" />;
  const mockOnClick = jest.fn();
  const { getByTestId } = render(<IconButton onClick={mockOnClick} icon={Icon} />);
  fireEvent.click(getByTestId('icon-button-root'));
  expect(mockOnClick).toBeCalledTimes(1);
});
