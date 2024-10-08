import { UserButton } from '@clerk/nextjs';
import { NavbarContent } from '@nextui-org/react';
import React, { ReactElement } from 'react';
import { CiHome } from 'react-icons/ci';

import ManagementDropdown from './ManagementDropdown';
import NavLink from './NavLink';
import StatsDropdown from './StatsDropdown';

export default function DesktopNavbarContent({
  userId,
  userRole,
  dropdownTextColor,
}: {
  userId: string | null;
  userRole: string | null;
  dropdownTextColor: string;
}): ReactElement {
  return (
    <NavbarContent justify="end" className="hidden md:flex">
      <NavLink href="/">
        <CiHome size={24} className="ml-2" />
      </NavLink>
      {userId ? (
        <div className="flex gap-4 items-center">
          {userRole === 'TRAINER' && (
            <ManagementDropdown dropdownTextColor={dropdownTextColor} />
          )}
          {userRole === 'TRAINER' && (
            <StatsDropdown dropdownTextColor={dropdownTextColor} />
          )}
          <NavLink href="/dashboard" className="text-white">
            Dashboard
          </NavLink>
          <NavLink href="/chat" className="text-white">
            Chat
          </NavLink>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <NavLink href="/sign-up" className="text-gray-700">
            Sign up
          </NavLink>
          <NavLink href="/sign-in" className="text-gray-700">
            Sign In
          </NavLink>
        </div>
      )}
    </NavbarContent>
  );
}
