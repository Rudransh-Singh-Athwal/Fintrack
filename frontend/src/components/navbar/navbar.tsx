"use client";
import React, { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/budgets", label: "Budgets" },
    // { href: "/reports", label: "Reports" },
  ];

  return (
    <nav className="relative flex justify-between items-center p-4 bg-white shadow-md text-black h-16">
      <div className="text-xl font-semibold ml-4 lg:ml-10 z-20">Fintrack</div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-6 text-lg items-center mr-10">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-blue-600">
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-white pt-24 flex flex-col items-center space-y-6 text-lg lg:hidden transition-transform duration-300 ease-in-out z-10 ${
          isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
