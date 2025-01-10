import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import NavLink from '@/components/navigation/NavLink';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';
import { NavBarUserContentProps } from '@/types/ui-types';

export function NavBarUserContent({
  userId,
  userRole,
  dropdownTextColor,
  stacked = false,
  closeMenu = () => {},
}: NavBarUserContentProps): React.ReactElement {
  const containerClasses = stacked
    ? 'flex flex-col items-center gap-4'
    : 'flex gap-4 items-center';

  return userId ? (
    <div className={containerClasses}>
      {userRole === 'TRAINER' && (
        <ManagementDropdown
          dropdownTextColor={dropdownTextColor}
          closeMenu={closeMenu}
        />
      )}
      {userRole === 'TRAINER' && (
        <StatsDropdown
          dropdownTextColor={dropdownTextColor}
          closeMenu={closeMenu}
        />
      )}
      {userRole === 'PLAYER' && (
        <NavLink href="/my-stats" className="text-white" onClick={closeMenu}>
          My Stats
        </NavLink>
      )}
      <NavLink href="/chat" className="text-white" onClick={closeMenu}>
        Chat
      </NavLink>
      {userRole === 'TRAINER' && (
        <NavLink
          href="/instructions"
          className="text-white"
          onClick={closeMenu}
        >
          Info
        </NavLink>
      )}
      <UserButton />
    </div>
  ) : (
    <div className={containerClasses}>
      <NavLink href="/sign-in" className="text-gray-700" onClick={closeMenu}>
        Sign In
      </NavLink>
    </div>
  );
}
