"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/websites", label: "Websites" },
  { href: "/devops", label: "DevOps" },
  { href: "/android", label: "Android" },
  { href: "https://github.com/PapsBurr", label: "GitHub", external: true },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLinkActive = (href: string, external?: boolean) => {
    if (external) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-gray-900 shadow-sm">
      {/* Title and Hamburger */}
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <h1 className="font-bold text-xl md:text-2xl text-white tracking-tight">
          Nathan's Dev Portfolio
        </h1>
        <button
          className="md:hidden text-white focus:outline-none"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-16 6h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Nav - Separate row */}
      <nav className="hidden md:block" data-testid="desktop-nav">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-1 lg:space-x-2 py-2">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, link.external);
              return (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-block px-3 lg:px-5 py-2 text-sm lg:text-base text-white font-medium rounded transition-colors duration-150 hover:bg-gray-800 hover:text-blue-400 whitespace-nowrap"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative inline-block px-3 lg:px-5 py-2 text-sm lg:text-base font-medium rounded transition-colors duration-150 whitespace-nowrap
                        ${
                          isActive
                            ? "bg-gray-800 text-blue-400"
                            : "text-white hover:bg-gray-800 hover:text-blue-400"
                        }
                      `}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2/3 h-0.5 bg-blue-500 rounded-full" />
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav
          className="md:hidden bg-gray-900 border-t border-gray-700"
          data-testid="mobile-nav"
        >
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, link.external);
              return (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-3 text-white font-medium transition-colors duration-150 hover:bg-gray-800 hover:text-blue-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-6 py-3 font-medium transition-colors duration-150
                        ${
                          isActive
                            ? "bg-gray-800 text-blue-400"
                            : "text-white hover:bg-gray-800 hover:text-blue-400"
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
