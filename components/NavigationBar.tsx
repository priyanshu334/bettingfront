import React from 'react';
import Link from 'next/link';

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-teal-400 to-teal-500 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-bold text-xl hover:text-red-100 transition-colors duration-300 transform hover:scale-105">
              HOME
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/cricket" className="text-white hover:text-teal-900 font-medium transition-colors duration-300 relative group">
                Cricket
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link href="/games" className="text-white hover:text-teal-900 font-medium transition-colors duration-300 relative group">
                Games
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button className="text-white hover:text-teal-900 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu - would need JS to toggle */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/cricket" className="block text-white hover:bg-teal-600 rounded px-3 py-2">
              Cricket
            </Link>
            <Link href="/games" className="block text-white hover:bg-teal-600 rounded px-3 py-2">
              Games
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;