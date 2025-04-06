"use client";
import React, { useEffect, useState } from "react";
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`, {
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
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-red-800 p-4 flex items-center justify-between text-white">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-white">
          <Image
            src="/img.jpeg" // Replace with your actual image file name
            alt="Logo"
            width={68}
            height={68}
            className="object-cover w-full h-full"
          />
        </div>
        <Link href="/" className="text-2xl font-semibold">
          <span className="text-yellow-300">Samrat</span> Online Booking
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <Link href="/rules" className="text-lg cursor-pointer">Rules</Link>
        <div className="text-sm">
          <p>Balance: ₹{user?.money?.toFixed(2) ?? "000.00"}</p>
          <p>Exposure: ₹000.00</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-lg cursor-pointer focus:outline-none"
          >
            {user?.fullName ?? "Guest"} ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              <Link href="/accounts" className="block px-4 py-2 hover:bg-gray-200">
                Account Statement
              </Link>
              <Link href="/betHistory" className="block px-4 py-2 hover:bg-gray-200">
                Bet History
              </Link>
              <Link href="/rules" className="block px-4 py-2 hover:bg-gray-200">
                Rules
              </Link>
              <Link href="/changePassword" className="block px-4 py-2 text-red-500 hover:bg-gray-200">
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200"
              >
                Signout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
