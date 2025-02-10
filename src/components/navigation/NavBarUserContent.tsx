import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import NavLink from '@/components/navigation/NavLink';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';
import {
  infoLabel,
  myStatsLabel,
  chatLabel,
  signInLabel,
} from '@/strings/clientStrings';
import { NavBarUserContentProps } from '@/types/ui-types';

function RoleSpecificLinks({
  userRole,
  dropdownTextColor,
  closeMenu,
}: {
  userRole: 'TRAINER' | 'PLAYER' | null;
  dropdownTextColor?: string;
  closeMenu: () => void;
}): React.ReactElement | null {
  switch (userRole) {
    case 'TRAINER':
      return (
        <>
          <ManagementDropdown
            dropdownTextColor={dropdownTextColor || ''}
            closeMenu={closeMenu}
          />
          <StatsDropdown
            dropdownTextColor={dropdownTextColor || ''}
            closeMenu={closeMenu}
          />
          <NavLink
            href="/instructions"
            className="text-white"
            onClick={closeMenu}
          >
            {infoLabel}
          </NavLink>
        </>
      );
    case 'PLAYER':
      return (
        <>
          <NavLink href="/my-stats" className="text-white" onClick={closeMenu}>
            {myStatsLabel}
          </NavLink>
          <NavLink
            href="/my-instructions"
            className="text-white"
            onClick={closeMenu}
          >
            {infoLabel}
          </NavLink>
        </>
      );
    default:
      return null;
  }
}

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

  const validUserRole =
    userRole === 'TRAINER' || userRole === 'PLAYER' ? userRole : null;

  if (!userId) {
    return (
      <div className={containerClasses}>
        <NavLink href="/sign-in" className="text-gray-700" onClick={closeMenu}>
          {signInLabel}
        </NavLink>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <NavLink href="/chat" className="text-white" onClick={closeMenu}>
        {chatLabel}
      </NavLink>
      <RoleSpecificLinks
        userRole={validUserRole}
        dropdownTextColor={dropdownTextColor}
        closeMenu={closeMenu}
      />
      <UserButton />
    </div>
  );
}
