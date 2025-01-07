'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { CiHome } from 'react-icons/ci';
import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';

import { homeLabel } from '@/strings/clientStrings';
import { MobileMenuProps } from '@/types/ui-types';

import { NavBarUserContent } from './NavBarUserContent';

export function MobileMenu({
  userId,
  userRole,
  dropdownTextColor,
}: MobileMenuProps): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close the menu
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className="text-white border border-white rounded p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Menu Content */}
      {menuOpen && (
        <div
          className="absolute top-0 bg-brandcolor z-50 flex flex-col items-center space-y-4 py-6 px-6 w-auto rounded-md shadow-lg"
          style={{ right: '-15px' }} // Explicit pixel positioning
          onClick={closeMenu} // Close menu on any click inside
        >
          {/* Home Link */}
          <Link
            href="/"
            className="text-white text-lg flex items-center space-x-2 w-full justify-start"
          >
            <CiHome size={24} />
            <span>{homeLabel}</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            className="text-white border border-white rounded p-2 flex items-center space-x-2 w-full justify-start"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Reuse NavBarUserContent with stacked layout */}
          <NavBarUserContent
            userId={userId}
            userRole={userRole}
            dropdownTextColor={dropdownTextColor}
            stacked={true} // Ensures vertical stacking
          />
        </div>
      )}
    </>
  );
}
