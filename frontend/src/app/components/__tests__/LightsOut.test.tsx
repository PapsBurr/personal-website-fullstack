import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LightsOut from '../LightsOut';
import { act } from 'react';

describe('LightsOut Component', () => {
  it('renders the game board', () => {
    render(<LightsOut />);

    act(() => {
      screen.getByRole('button', { name: /Show Game/i }).click();
    });
    
    const buttons = screen.getAllByRole('button', { name: /Toggle light at row \d, column \d/i });
    expect(buttons).toHaveLength(9); // 3x3 grid
  });

  it('toggles cell state on click', () => {
    render(<LightsOut />);

    act(() => {
      screen.getByRole('button', { name: /Show Game/i }).click();
    });

    const firstCell = screen.getByLabelText('Toggle light at row 1, column 1');
    if (firstCell.className.includes('bg-[var(--square-color-off)]')) {
      act(() => {
        firstCell.click();
      });
    }
    expect(firstCell).toHaveClass('bg-[var(--square-color-on)]');

    act(() => {
        firstCell.click();
      });
    expect(firstCell).toHaveClass('bg-[var(--square-color-off)]');
  });

  it('resets the game board when New Game button is clicked, checks five times to account for randomness', () => {
    render(<LightsOut />);
    
    act(() => {
      screen.getByRole('button', { name: /Show Game/i }).click();
    });

    const getBoardState = () =>
    screen.getAllByLabelText(/Toggle light at row \d, column \d/i).map(
      btn => btn.className
    );

    const beforeReset = getBoardState();

    const resetButton = screen.getByRole('button', { name: /New Game/i });

    act(() => {
      resetButton.click();
    });

    let afterReset = getBoardState();
    let attempts = 0;
    while (afterReset.toString() === beforeReset.toString() && attempts < 5) {
      act(() => {
        resetButton.click();
      });
      afterReset = getBoardState();
      attempts++;
    }
    expect(afterReset).not.toEqual(beforeReset);
  });

  it('renders each light button with the correct class', () => {
    render(<LightsOut />);

    act(() => {
      screen.getByRole('button', { name: /Show Game/i }).click();
    });

    const buttons = screen.getAllByLabelText(/Toggle light at row \d, column \d/i);
    buttons.forEach(button => {
      expect(
        button.className.includes('bg-[var(--square-color-on)]') || 
        button.className.includes('bg-[var(--square-color-off)]')
      ).toBe(true);
      expect(button.className.includes('w-10 h-10 m-1 rounded border border-gray-500 transition-colors duration-100')).toBe(true);
    });
  });

  it('renders the grid size slider', () => {
    render(<LightsOut />);

    act(() => {
      screen.getByRole('button', { name: /Show Game/i }).click();
    });

    const slider = screen.getByLabelText(/Grid Size:/i);
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '3');
    expect(slider).toHaveAttribute('max', '9');
    expect(slider).toHaveClass('slider');
  });
});