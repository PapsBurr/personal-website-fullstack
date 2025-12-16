import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { act } from 'react';

const createMockMatchMedia = (matches) => (query) => ({
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
      value: createMockMatchMedia(true), // true = matches mobile query
    });

    // Set mobile screen dimensions
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
    // Clean up mocks after each test
    jest.restoreAllMocks();
  });
  
  it('renders hamburger menu on mobile', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    expect(hamburgerButton).toBeInTheDocument();
  })
  it('doesn\'t render the nav buttons until the hambuger button is pressed', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    expect(screen.queryByRole('link', { name: /Home Link - Mobile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Websites Link - Mobile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /DevOps Link - Mobile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Android Link - Mobile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /GitHub Link - Mobile/i })).not.toBeInTheDocument();

    act(() => {
      hamburgerButton.click();
    })

    expect(screen.queryByRole('link', { name: /Home Link - Mobile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Websites Link - Mobile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /DevOps Link - Mobile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Android Link - Mobile/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /GitHub Link - Mobile/i })).toBeInTheDocument();
  })
  it('has the correct css', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });

    act(() => {
      hamburgerButton.click();
    })

    const mobileNav = screen.getAllByRole('navigation')[1];
    expect(mobileNav).toHaveClass('md:hidden mt-4');

    const mobileNavLinks = within(mobileNav).getAllByRole('link');
    mobileNavLinks.forEach(link => {
      expect(link).toHaveClass('block p-4 px-16');
    });
  })
  it('closes mobile menu when a mobile link is clicked', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    
    // Open mobile menu
    act(() => {
      hamburgerButton.click();
    });
    
    const mobileHomeLink = screen.getByLabelText('Home Link - Mobile');
    
    act(() => {
      mobileHomeLink.click();
    });
    
    // Mobile menu should be closed now
    expect(screen.queryByLabelText('Home Link - Mobile')).not.toBeInTheDocument();
  });
  it('toggles hamburger icon when menu opens and closes', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    const svg = hamburgerButton.querySelector('svg');
    
    // Initially shows hamburger icon (three lines)
    expect(svg.querySelector('path')).toHaveAttribute('d', 'M4 6h16M4 12h16m-16 6h16');
    
    act(() => {
      hamburgerButton.click();
    });
    
    // Now shows X icon
    expect(svg.querySelector('path')).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
    
    act(() => {
      hamburgerButton.click();
    });
    
    // Back to hamburger icon
    expect(svg.querySelector('path')).toHaveAttribute('d', 'M4 6h16M4 12h16m-16 6h16');
  });
  it('closes mobile menu when any mobile link is clicked', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    
    const linkTests = [
      'Home Link - Mobile',
      'Websites Link - Mobile', 
      'Android Link - Mobile',
      'GitHub Link - Mobile'
    ];
    
    linkTests.forEach(linkLabel => {
      // Open menu
      act(() => {
        hamburgerButton.click();
      });

      // Verify link is in the document
      expect(screen.getByLabelText(linkLabel)).toBeInTheDocument();
      
      // Click specific link
      const link = screen.getByLabelText(linkLabel);
      act(() => {
        link.click();
      });
      
      // Menu should close
      expect(screen.queryByLabelText('Home Link - Mobile')).not.toBeInTheDocument();
    });
  });
  it('can toggle mobile menu multiple times', () => {
    render(<Header />);
    const hamburgerButton = screen.getByRole('button', { name: /Toggle hamburger menu/i });
    
    // Initially closed
    expect(screen.queryByLabelText('Home Link - Mobile')).not.toBeInTheDocument();
    
    // Open
    act(() => {
      hamburgerButton.click();
    });
    expect(screen.getByLabelText('Home Link - Mobile')).toBeInTheDocument();
    
    // Close with button
    act(() => {
      hamburgerButton.click();
    });
    expect(screen.queryByLabelText('Home Link - Mobile')).not.toBeInTheDocument();
    
    // Open again
    act(() => {
      hamburgerButton.click();
    });
    expect(screen.getByLabelText('Home Link - Mobile')).toBeInTheDocument();
  });
});