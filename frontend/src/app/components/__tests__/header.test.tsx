import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { act } from 'react';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

const createMockMatchMedia = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('Desktop Header Component', () => {
  it('renders the desktop main title', () => {
    render(<Header />);
    const title = screen.getByRole('heading', { name: /Nathan's/i });
    expect(title).toBeInTheDocument();
  });

  it('renders the desktop Home link', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the desktop Websites link', () => {
    render(<Header />);
    const websitesLink = screen.getByRole('link', { name: /Websites/i });
    expect(websitesLink).toBeInTheDocument();
    expect(websitesLink).toHaveAttribute('href', '/websites');
  });

  it('renders the desktop Android link', () => {
    render(<Header />);
    const androidLink = screen.getByRole('link', { name: /Android/i });
    expect(androidLink).toBeInTheDocument();
    expect(androidLink).toHaveAttribute('href', '/android');
  });

  it('renders the desktop GitHub link', () => {
    render(<Header />);
    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/PapsBurr');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });
});

describe('Mobile Header Component', () => {
  beforeEach(() => {
    // Mock mobile viewport
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(true),
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 412,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 915,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('renders hamburger menu on mobile', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  it("doesn't render the nav links until the hamburger button is pressed", () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    // Mobile nav should not be visible initially
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    
    act(() => {
      hamburgerButton.click();
    });
    
    // Now mobile nav should be visible
    const mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();
    
    const links = within(mobileNav).getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('has the correct mobile nav styling', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });

    act(() => {
      hamburgerButton.click();
    });

    const mobileNav = screen.getAllByRole('navigation')[1];
    expect(mobileNav).toHaveClass('md:hidden');
    expect(mobileNav).toHaveClass('bg-gray-900');
    expect(mobileNav).toHaveClass('border-t');
    expect(mobileNav).toHaveClass('border-gray-700');

    const mobileNavLinks = within(mobileNav).getAllByRole('link');
    mobileNavLinks.forEach((link) => {
      expect(link).toHaveClass('block');
      expect(link).toHaveClass('px-6');
      expect(link).toHaveClass('py-3');
    });
  });

  it('closes mobile menu when a mobile link is clicked', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    // Open mobile menu
    act(() => {
      hamburgerButton.click();
    });
    
    const mobileNav = screen.getByTestId('mobile-nav');
    const mobileHomeLink = within(mobileNav).getByRole('link', { name: /^Home$/i });
    
    act(() => {
      mobileHomeLink.click();
    });
    
    // Mobile menu should be closed now
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });

  it('toggles hamburger icon when menu opens and closes', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    const svg = hamburgerButton.querySelector('svg');
    
    // Initially shows hamburger icon (three lines)
    let path = svg?.querySelector('path');
    expect(path).toHaveAttribute('d', 'M4 6h16M4 12h16m-16 6h16');
    
    act(() => {
      hamburgerButton.click();
    });
    
    // Now shows X icon
    path = svg?.querySelector('path');
    expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
    
    act(() => {
      hamburgerButton.click();
    });
    
    // Back to hamburger icon
    path = svg?.querySelector('path');
    expect(path).toHaveAttribute('d', 'M4 6h16M4 12h16m-16 6h16');
  });

  it('closes mobile menu when any mobile link is clicked', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    const linkLabels = ['Home', 'Websites', 'DevOps', 'Android', 'GitHub'];
    
    linkLabels.forEach((linkLabel) => {
      // Open menu
      act(() => {
        hamburgerButton.click();
      });

      const mobileNav = screen.getByTestId('mobile-nav');
      const link = within(mobileNav).getByRole('link', { name: new RegExp(`^${linkLabel}$`, 'i') });
      
      expect(link).toBeInTheDocument();
      
      // Click specific link
      act(() => {
        link.click();
      });
      
      // Menu should close
      expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    });
  });

  it('can toggle mobile menu multiple times', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    // Initially closed
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    
    // Open
    act(() => {
      hamburgerButton.click();
    });
    let mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();
    
    // Close with button
    act(() => {
      hamburgerButton.click();
    });
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    
    // Open again
    act(() => {
      hamburgerButton.click();
    });
    mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();
  });

  it('highlights the active link in mobile menu', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/android');
    
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle menu/i });
    
    act(() => {
      hamburgerButton.click();
    });
    
    const mobileNav = screen.getByTestId('mobile-nav');
    const androidLink = within(mobileNav).getByRole('link', { name: /^Android$/i });
    
    expect(androidLink).toHaveClass('bg-gray-800');
    expect(androidLink).toHaveClass('text-blue-400');
  });
});