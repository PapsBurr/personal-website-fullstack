import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Page from '../page'

describe('Page Component', () => {
  it('renders the page with correct titles throughout the document', () => {
    render(<Page />);
    // Check if the main title is present
    const mainTitle = screen.getByRole('heading', { name: /Websites/i });
    expect(mainTitle).toBeInTheDocument();
  });
    
  it('renders the subheading for Ecommerce Fullstack', () => {
    render(<Page />);
    const subHeading = screen.getByRole('heading', { name: /Ecommerce Fullstack/i });
    expect(subHeading).toBeInTheDocument();
  });
});