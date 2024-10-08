import Link from 'next/link';
import React, { ReactElement } from 'react';
import { CiHome } from 'react-icons/ci';

import NavLink from '@/components/navigation/NavLink';
import { MobileMenuProps } from '@/types/types';

import ManagementDropdown from './ManagementDropdown';
import StatsDropdown from './StatsDropdown';
import ThemeToggleButton from './ThemeToggleButton';

export default function MobileMenu({
  userId,
  userRole,
  menuOpen,
  dropdownTextColor,
}: MobileMenuProps): ReactElement | null {
  if (!menuOpen) return null;

  return (
    <div className="flex flex-col items-center bg-brandcolor w-auto py-4 mt-12">
      <div className="h-72 mr-7"></div>
      <Link href="/" className="text-white w-auto my-2 flex items-center">
        <CiHome size={24} />
        <span className="ml-2">Home</span>
      </Link>
      <ThemeToggleButton />
      {userId ? (
        <div className="flex flex-col items-center">
          {userRole === 'TRAINER' && (
            <ManagementDropdown dropdownTextColor={dropdownTextColor} />
          )}
          {userRole === 'TRAINER' && (
            <StatsDropdown dropdownTextColor={dropdownTextColor} />
          )}
          <Link href="/dashboard" className="text-white w-auto my-2">
            Dashboard
          </Link>
          <NavLink href="/chat" className="text-white">
            Chat
          </NavLink>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Link href="/sign-up" className="text-white w-auto my-2">
            Sign up
          </Link>
          <Link href="/sign-in" className="text-white w-auto my-2">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
