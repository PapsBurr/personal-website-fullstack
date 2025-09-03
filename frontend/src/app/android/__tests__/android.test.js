import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

describe('Page Component', () => {
  it('renders the page with correct titles throughout the document', () => {
    render(<Page />);

    // Check if the main title is present
    const mainTitle = screen.getByRole('heading', { name: /Android apps/i });
    expect(mainTitle).toBeInTheDocument();

    // Check if the first project title is present
    const firstProjectTitle = screen.getByRole('heading', { name: /Vacation Planner App/i });
    expect(firstProjectTitle).toBeInTheDocument();

    // Check if the second project title is present
    const secondProjectTitle = screen.getByRole('heading', { name: /Lights Out/i });
    expect(secondProjectTitle).toBeInTheDocument();

    // Check if the third project title is present
    const thirdProjectTitle = screen.getByRole('heading', { name: /Timer App/i });
    expect(thirdProjectTitle).toBeInTheDocument();
  });

  it('renders images for each project', () => {
    render(<Page />);

    // Check if all images are rendered
    const vacationImage = screen.getByAltText('An image of the vacation planner log in screen.');
    expect(vacationImage).toBeInTheDocument();

    const vacationImage2 = screen.getByAltText('An image of the vacation planner main screen');
    expect(vacationImage2).toBeInTheDocument();

    const vacationImage3 = screen.getByAltText('An image of the vacation planner details screen');
    expect(vacationImage3).toBeInTheDocument();

    const lightsOutImage = screen.getByAltText('An image of the lights out game');
    expect(lightsOutImage).toBeInTheDocument();

    const timerImage = screen.getByAltText('An image of the timer app');
    expect(timerImage).toBeInTheDocument();
  });
});