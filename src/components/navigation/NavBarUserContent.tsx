import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import NavLink from '@/components/navigation/NavLink';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';

interface NavBarUserContentProps {
  userId: string | null;
  userRole: string | null;
  dropdownTextColor: string;
  stacked?: boolean;
}

export function NavBarUserContent({
  userId,
  userRole,
  dropdownTextColor,
  stacked = false, // Default to horizontal layout
}: NavBarUserContentProps): React.ReactElement {
  const containerClasses = stacked
    ? 'flex flex-col items-center gap-4' // Vertical stacking
    : 'flex gap-4 items-center'; // Horizontal layout (default)

  return userId ? (
    <div className={containerClasses}>
      {userRole === 'TRAINER' && (
        <ManagementDropdown dropdownTextColor={dropdownTextColor} />
      )}
      {userRole === 'TRAINER' && (
        <StatsDropdown dropdownTextColor={dropdownTextColor} />
      )}
      <NavLink href="/chat" className="text-white">
        Chat
      </NavLink>
      {userRole === 'TRAINER' && (
        <NavLink href="/instructions" className="text-white">
          Info
        </NavLink>
      )}
      <UserButton />
    </div>
  ) : (
    <div className={containerClasses}>
      <NavLink href="/sign-in" className="text-gray-700">
        Sign In
      </NavLink>
    </div>
  );
}
