'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { CiHome } from 'react-icons/ci';
import { FiMenu, FiX } from 'react-icons/fi';

import { homeLabel } from '@/strings/clientStrings';
import { MobileMenuProps } from '@/types/ui-types';

import { NavBarUserContent } from './NavBarUserContent';
import { ThemeToggleButton } from './ThemeToggleButton';

export function MobileMenu({
  userId,
  userRole,
  dropdownTextColor,
}: MobileMenuProps): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = (): void => setMenuOpen(false);

  return (
    <>
      <button
        className="text-white border border-white rounded p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {menuOpen && (
        <div
          className="absolute top-0 bg-brandcolor z-50 flex flex-col items-center space-y-4 py-6 px-6 w-auto rounded-md shadow-lg"
          style={{ right: '-15px' }}
        >
          <Link
            href="/"
            className="text-white text-lg flex items-center space-x-2 w-full justify-start"
            onClick={closeMenu}
          >
            <CiHome size={24} />
            <span>{homeLabel}</span>
          </Link>

          <ThemeToggleButton onPress={closeMenu} />

          <NavBarUserContent
            userId={userId}
            userRole={userRole}
            dropdownTextColor={dropdownTextColor}
            stacked={true}
            closeMenu={closeMenu}
          />
        </div>
      )}
    </>
  );
}
