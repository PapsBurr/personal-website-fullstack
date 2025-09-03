"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="p-5 pb-2 bg-gradient-to-b from-gray-700 to-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="font-sans font-extrabold tracking-normal my-8 mb-16 text-6xl text-white mx-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'}}>
          Nathan's Clubhouse
        </h1>

        <button
          className="md:hidden text-white focus:outline-none"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle hamburger menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-16 6h16" />
            )}
          </svg>
        </button>
      </div>

      <div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-wrap justify-start">
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 via-20% to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:via-20% hover:to-gray-900 active:from-gray-900 active:via-50% active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
            <Link 
            href="/"
            className="block p-3 px-16">Home</Link>
          </div>
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 via-20% to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:via-20% hover:to-gray-900 active:from-gray-900 active:via-50% active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
            <Link 
            href="/websites"
            className="block p-3 px-16">Websites</Link>
          </div>
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 via-20% to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:via-20% hover:to-gray-900 active:from-gray-900 active:via-50% active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
            <Link 
            href="/devops"
            className="block p-3 px-16">DevOps</Link>
          </div>
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 via-20% to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:via-20% hover:to-gray-900 active:from-gray-900 active:via-50% active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
            <Link 
            href="/android"
            className="block p-3 px-16">Android</Link>
          </div>
          <div className="bg-gradient-to-b from-gray-700 via-gray-800 via-20% to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:via-20% hover:to-gray-900 active:from-gray-900 active:via-50% active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
            <a 
            href="https://github.com/PapsBurr" 
            target="_blank"
            className="block p-3 px-16">GitHub</a>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4">
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-900 active:from-gray-900 active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
              <Link
                href="/"
                aria-label="Home Link - Mobile"
                className="block p-4 px-16"
                onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            </div>
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-900 active:from-gray-900 active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
              <Link
                href="/websites"
                aria-label="Websites Link - Mobile"
                className="block p-4 px-16"
                onClick={() => setIsMobileMenuOpen(false)}>Websites</Link>
            </div>
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-900 active:from-gray-900 active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
              <Link
                href="/android"
                aria-label="Android Link - Mobile"
                className="block p-4 px-16"
                onClick={() => setIsMobileMenuOpen(false)}>Android</Link>
            </div>
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-900 active:from-gray-900 active:to-gray-800 text-white font-bold m-4 rounded-md select-none">
              <a
                href="https://github.com/PapsBurr"
                aria-label="GitHub Link - Mobile"
                target="_blank"
                className="block p-4 px-16"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GitHub
              </a>
            </div>
          </nav>
        )}

      </div>
    </header>
  );
}
