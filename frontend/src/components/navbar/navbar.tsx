"use client";
import React, { useState } from "react";
import { useTheme } from "@/src/components/theme/theme-provider";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    // { href: "/budgets", label: "Budgets" },
    // { href: "/reports", label: "Reports" },
  ];

  return (
    <nav className="relative flex justify-between items-center p-4 h-16 border-b transition-colors duration-200 bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)]">
      <Link href="/">
        <div className="text-xl font-semibold ml-4 lg:ml-10 z-20">Fintrack</div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex space-x-6 text-lg items-center mr-10">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--surface-muted)] hover:opacity-90 transition-opacity duration-200"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-blue-500 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-2 lg:hidden z-20 mr-4">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--surface-muted)] hover:opacity-90 transition-opacity duration-200"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
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
        className={`absolute top-0 left-0 w-full h-screen pt-24 flex flex-col items-center space-y-6 text-lg lg:hidden transition-transform duration-300 ease-in-out z-10 bg-[var(--surface)] border-[var(--border)] ${
          isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-blue-500 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function MoonIcon() {
  return (
    <svg
      className="h-5 w-5 text-[var(--foreground)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className="h-5 w-5 text-[var(--foreground)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 3v2m0 14v2m8.49-8.49H22m-20 0h1.51m15.07-7.07-1.42 1.42M6.34 17.66l-1.42 1.42m0-14.14 1.42 1.42m10.61 10.61 1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      />
    </svg>
  );
}
