'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Home Link */}
          <Link
            href="/"
            className="text-white font-bold text-xl hover:text-red-100 transition-transform duration-300 transform hover:scale-105"
          >
            HOME
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/cricket"
              className="text-white hover:text-teal-900 font-medium relative group transition-colors duration-300"
            >
              Cricket
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/games"
              className="text-white hover:text-teal-900 font-medium relative group transition-colors duration-300"
            >
              Games
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-teal-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3">
            <div className="space-y-1">
              <Link
                href="/cricket"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white hover:bg-teal-600 rounded px-4 py-2"
              >
                Cricket
              </Link>
              <Link
                href="/games"
                onClick={() => setIsMenuOpen(false)}
                className="block text-white hover:bg-teal-600 rounded px-4 py-2"
              >
                Games
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
