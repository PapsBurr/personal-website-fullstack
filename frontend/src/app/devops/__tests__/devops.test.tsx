import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

describe('Devops Page Component', () => {
  it('renders a title for the devops page', () => {
    render(<Page />);
    const titleElement = screen.getByRole('heading', { name: /devops/i });
    expect(titleElement).toBeInTheDocument();
  })

  // GitHub Actions Section 

  it('renders a subheading for the GitHub Actions section', () => {
    render(<Page />);
    const subheadingElement = screen.getByRole('heading', { name: /github actions/i });
    expect(subheadingElement).toBeInTheDocument();
  })

  it('renders screenshots of the process of setting up GitHub Actions', () => {
    render(<Page />);
    const screenshotElements = screen.getAllByRole('img', { name: /github actions/i });
    expect(screenshotElements.length).toBeGreaterThan(0);
  })

  // Docker Section
  /*
  it('renders a subheading for the docker section', () => {
    render(<Page />);
    const subheadingElement = screen.getByRole('heading', { name: /docker/i });
    expect(subheadingElement).toBeInTheDocument();
  })

  it('renders screenshots of the process of creating docker images and containers', () => {
    render(<Page />);
    const screenshotElements = screen.getAllByRole('img', { name: /docker/i });
    expect(screenshotElements.length).toBeGreaterThan(0);
  })

  // Kubernetes Section

  it('renders a subheading for the kubernetes section', () => {
    render(<Page />);
    const subheadingElement = screen.getByRole('heading', { name: /kubernetes/i });
    expect(subheadingElement).toBeInTheDocument();
  })

  it('renders screenshots of the process of creating a kubernetes cluster', () => {
    render(<Page />);
    const screenshotElements = screen.getAllByRole('img', { name: /kubernetes/i });
    expect(screenshotElements.length).toBeGreaterThan(0);
  })

  // AWS Section

  it('renders a subheading for the AWS section', () => {
    render(<Page />);
    const subheadingElement = screen.getByRole('heading', { name: /aws/i });
    expect(subheadingElement).toBeInTheDocument();
  })

  it('renders screenshots of the process of creating an aws infrastructure', () => {
    render(<Page />);
    const screenshotElements = screen.getAllByRole('img', { name: /aws/i });
    expect(screenshotElements.length).toBeGreaterThan(0);
  })
  */
});