import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

describe('Home Page', () => {
  it('renders my name on the page', () => {
    render(<Page />);
    const myName = screen.getByRole('heading', { name: /Nathan Pons/i });
    expect(myName).toBeInTheDocument();
  });

  it('renders the software engineer title', () => {
    render(<Page />);
    const title = screen.getByRole('heading', { name: /Software Engineer/i });
    expect(title).toBeInTheDocument();
  });

  it('renders the about me section', () => {
    render(<Page />);
    const aboutMe = screen.getByText(/Hi! My name is Nathan Pons/i);
    expect(aboutMe).toBeInTheDocument();
  });

  it('renders qualifications heading', () => {
    render(<Page />);
    const qualifications = screen.getByRole('heading', { name: /Qualifications/i });
    expect(qualifications).toBeInTheDocument();
  });

  it('renders the correct number of certification list items', () => {
    render(<Page />);
    const certifications = screen.getAllByTestId('cert-item');
    expect(certifications.length).toBe(4);
    expect(certifications[0]).toHaveTextContent('AWS Certified Cloud Practitioner');
  });

  it('renders skills list', () => {
    render(<Page />);
    const skillsList = screen.getByTestId('skills-list');
    expect(skillsList).toBeInTheDocument();
  });

  it('renders programming languages list', () => {
    render(<Page />);
    const languagesList = screen.getByTestId('programming-languages-list');
    expect(languagesList).toBeInTheDocument();
  });

  it('renders correct number of skills', () => {
    render(<Page />);
    const skillsList = screen.getByTestId('skills-list');
    const skillItems = skillsList.querySelectorAll('li');
    expect(skillItems.length).toBe(7); // Should match skills array length
  });

  it('renders correct number of programming languages', () => {
    render(<Page />);
    const languagesList = screen.getByTestId('programming-languages-list');
    const languageItems = languagesList.querySelectorAll('li');
    expect(languageItems.length).toBe(9); // Should match pgrmLanguages array length
  });
});