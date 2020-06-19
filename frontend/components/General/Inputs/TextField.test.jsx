import { render, cleanup, fireEvent } from '@testing-library/react';
import TextField from './TextField';

afterEach(cleanup);

it('should render with expected props', () => {
  const label = 'test label';
  const { getByTestId } = render(<TextField label={label} onChange={() => {}} />);
  expect(getByTestId('label')).toHaveTextContent(label);
});

it('should fire onChange event', () => {
  const label = 'test label';
  const mockOnChange = jest.fn();
  const { getByTestId } = render(<TextField label={label} onChange={mockOnChange} />);
  const input = 'test input';
  fireEvent.change(getByTestId('input'), { target: { value: input } });
  expect(mockOnChange).toBeCalledTimes(1);
  expect(mockOnChange).toBeCalledWith(input);
});

it('should have the correct input value', () => {
  const label = 'test label';
  const value = 'test value';
  const { getByTestId } = render(<TextField label={label} onChange={() => {}} value={value} />);
  expect(getByTestId('input')).toHaveValue(value);
});

it('should have the correct placeholder', () => {
  const label = 'test label';
  const placeholder = 'test-placeholder';
  const { getByTestId } = render(
    <TextField label={label} onChange={() => {}} placeholder={placeholder} />,
  );
  expect(getByTestId('input')).toHaveAttribute('placeholder', placeholder);
});

it('should have the correct input type', () => {
  const label = 'test label';
  const type = 'number';
  const { getByTestId } = render(<TextField label={label} onChange={() => {}} type={type} />);
  expect(getByTestId('input')).toHaveAttribute('type', type);
});
