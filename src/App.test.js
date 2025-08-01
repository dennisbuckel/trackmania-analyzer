import { render, screen } from '@testing-library/react';
import App from './App';

test('renders trackmania analyzer app', () => {
  render(<App />);
  // Test that the app renders without crashing
  const appElement = screen.getByText('Trackmania COTD Analyzer');
  expect(appElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(<App />);
  // Look for the welcome heading
  const welcomeElement = screen.getByText(/Welcome to COTD Analyzer/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders data extractor section', () => {
  render(<App />);
  // Look for the data extractor heading
  const extractorElement = screen.getByText(/Data Extractor/i);
  expect(extractorElement).toBeInTheDocument();
});
