import { cleanup } from '@testing-library/react';
import { renderWithContext } from '../../utils/tests';
import DashboardLayout from './DashboardLayout';

afterEach(cleanup);

it('should render with expected children', () => {
  const Children = () => <div data-testid="child">children</div>;
  const { queryByTestId } = renderWithContext(
    <DashboardLayout>
      <Children />
    </DashboardLayout>,
  );
  expect(queryByTestId('child')).toBeTruthy();
});
