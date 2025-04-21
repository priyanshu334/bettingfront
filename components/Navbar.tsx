"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
  userId: string;
  fullName: string;
  phone: string;
  money: number;
}

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTokenFromStorage = (): string | null => {
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getTokenFromStorage();
      if (!token) return;

      try {
        const base64Url = token.split(".")[1];
        if (!base64Url) throw new Error("Invalid token format");

        const decodedPayload = JSON.parse(atob(base64Url));
        const userId = decodedPayload?.userId;

        if (!userId) throw new Error("Invalid userId in token");
        console.log("user id is ",userId)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
        setUser(null);
        // Clear invalid token
        localStorage.removeItem('authToken');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-red-800 p-4 text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-2 md:mr-3 bg-white flex-shrink-0">
              <Image
                src="/img.jpeg"
                alt="Logo"
                width={68}
                height={68}
                className="object-cover w-full h-full"
              />
            </div>
            <Link href="/" className="text-xl md:text-2xl font-semibold">
              <span className="text-yellow-300">Samrat</span>{" "}
              <span className="hidden sm:inline">Online Booking</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setDropdownOpen(false);
              }}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/rules" className="text-lg hover:text-yellow-200 transition-colors">
              Rules
            </Link>
            <div className="px-3 py-1 bg-gradient-to-r from-red-900 to-red-800 rounded-lg shadow">
              <p className="text-sm">Balance: ₹{user?.money?.toFixed(2) ?? "000.00"}</p>
              <p className="text-sm">Exposure: ₹000.00</p>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-lg cursor-pointer hover:text-yellow-200 transition-colors flex items-center"
              >
                {user?.fullName ?? "Guest"}{" "}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-95 backdrop-blur-sm text-black rounded-lg shadow-xl z-100 overflow-hidden border border-gray-200">
                  <Link href="/accounts" className="block px-4 py-2 hover:bg-gray-200 transition-colors">
                    Account Statement
                  </Link>
                  <Link href="/betHistory" className="block px-4 py-2 hover:bg-gray-200 transition-colors">
                    Bet History
                  </Link>
                  <Link href="/rules" className="block px-4 py-2 hover:bg-gray-200 transition-colors">
                    Rules
                  </Link>
                  <Link href="/changePassword" className="block px-4 py-2 text-red-500 hover:bg-gray-200 transition-colors">
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200 transition-colors"
                  >
                    Signout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-gradient-to-r from-red-900 to-red-800 rounded-lg p-4 space-y-3">
            <Link href="/rules" className="block text-lg hover:text-yellow-200 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Rules
            </Link>
            <div className="flex justify-between items-center py-2 border-t border-red-700">
              <p className="text-sm">Balance:</p>
              <p className="text-sm font-bold">₹{user?.money?.toFixed(2) ?? "000.00"}</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-red-700">
              <p className="text-sm">Exposure:</p>
              <p className="text-sm font-bold">₹000.00</p>
            </div>
            <Link href="/accounts" className="block py-2 hover:text-yellow-200 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Account Statement
            </Link>
            <Link href="/betHistory" className="block py-2 hover:text-yellow-200 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Bet History
            </Link>
            <Link href="/changePassword" className="block py-2 text-red-300 hover:text-red-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Change Password
            </Link>
            <button onClick={handleLogout} className="w-full text-left py-2 text-blue-300 hover:text-blue-100 transition-colors">
              Signout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;