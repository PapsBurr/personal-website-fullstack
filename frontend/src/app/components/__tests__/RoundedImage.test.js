import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoundedImage from '../RoundedImage';

describe('RoundedImage Component', () => {
  it('renders the image with correct src, alt text, width and height', () => {
    render(<RoundedImage src="/test-image.png" alt="Test Image" width={100} height={100}/>);
    const image = screen.getByRole('img', { name: /Test Image/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/_next/image?url=%2Ftest-image.png&w=256&q=75');
    expect(image).toHaveAttribute('alt', 'Test Image');
    expect(image).toHaveAttribute('width', '100');
    expect(image).toHaveAttribute('height', '100');
  });

  it('applies the correct class for rounded corners', () => {
    render(<RoundedImage src="/test-image2.png" alt="Test Image2" width={50} height={50}/>);
    const image = screen.getByRole('img', { name: /Test Image2/i });
    expect(image).toHaveClass('rounded-[20px] shadow-md/40');
  });
});