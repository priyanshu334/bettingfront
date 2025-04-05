"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-red-800 p-4 flex items-center justify-between text-white">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-white rounded-full mr-3"></div>
        <Link href="/" className="text-2xl font-semibold">
          <span className="text-yellow-300">Saffron</span> Exch
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <Link href="/rules" className="text-lg cursor-pointer">Rules</Link>
        <div className="text-sm">
          <p>Balance: 000.00</p>
          <p>Exposure: 000.00</p>
        </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-lg cursor-pointer focus:outline-none">
            Demo123 ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <Link href="/accounts" className="block px-4 py-2 hover:bg-gray-200">Account Statement</Link>
              <Link href="/betHistory" className="block px-4 py-2 hover:bg-gray-200">Bet History</Link>
              <Link href="/rules" className="block px-4 py-2 hover:bg-gray-200">Rules</Link>
              <Link href="/changePassword" className="block px-4 py-2 text-red-500 hover:bg-gray-200">Change Password</Link>
              <Link href="/login" className="block px-4 py-2 text-blue-500 hover:bg-gray-200">Signout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
