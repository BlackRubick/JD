import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BioPsyTech hero title', () => {
  render(<App />);
  const titleElement = screen.getByText(/BioPsyTech/i);
  expect(titleElement).toBeInTheDocument();
});
