import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Psybioneer hero title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Psybioneer/i);
  expect(titleElement).toBeInTheDocument();
});
