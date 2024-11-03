import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import NavLink from '@/components/navigation/NavLink';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';

interface NavBarUserContentProps {
  userId: number | null;
  userRole: string | null;
  dropdownTextColor: string;
}

export function NavBarUserContent({
  userId,
  userRole,
  dropdownTextColor,
}: NavBarUserContentProps): React.ReactElement {
  return userId ? (
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
  );
}
