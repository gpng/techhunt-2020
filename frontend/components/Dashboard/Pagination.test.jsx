/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

afterEach(cleanup);

const requiredProps = {
  prevLabel: 'Prev',
  nextLabel: 'Next',
};

it('should render', () => {
  render(<Pagination {...requiredProps} />);
});

it('should have a previous and next button with labels', () => {
  const { getByTestId } = render(<Pagination {...requiredProps} />);
  expect(getByTestId('button-prev')).toHaveTextContent(requiredProps.prevLabel);
  expect(getByTestId('button-next')).toHaveTextContent(requiredProps.nextLabel);
});

it('should fire onPrevClick or onNextClick button click', () => {
  const mockOnPrevClick = jest.fn();
  const mockOnNextClick = jest.fn();
  const { getByTestId } = render(
    <Pagination {...requiredProps} onPrevClick={mockOnPrevClick} onNextClick={mockOnNextClick} />,
  );
  fireEvent.click(getByTestId('button-prev'));
  fireEvent.click(getByTestId('button-next'));
  expect(mockOnPrevClick).toBeCalledTimes(1);
  expect(mockOnNextClick).toBeCalledTimes(1);
});

it('should disable prev button and next button if no function passed', () => {
  const { getByTestId } = render(<Pagination {...requiredProps} />);
  expect(getByTestId('button-prev')).toBeDisabled();
  expect(getByTestId('button-next')).toBeDisabled();
});

it('should display min and max results', () => {
  const min = 10;
  const max = 20;
  const { getByTestId } = render(<Pagination {...requiredProps} min={min} max={max} />);
  expect(getByTestId('label')).toHaveTextContent(`${min} - ${max}`);
});
