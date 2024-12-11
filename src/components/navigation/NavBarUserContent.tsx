import { UserButton } from '@clerk/nextjs';
import React from 'react';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import NavLink from '@/components/navigation/NavLink';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';
import {
  dashboardLabel,
  chatLabel,
  signInLabel,
} from '@/strings/clientStrings';
import { NavBarUserContentProps } from '@/types/ui-types';

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
        {dashboardLabel}
      </NavLink>
      <NavLink href="/chat" className="text-white">
        {chatLabel}
      </NavLink>
      <UserButton afterSignOutUrl="/" />
    </div>
  ) : (
    <div className="flex gap-4 items-center">
      <NavLink href="/sign-in" className="text-gray-700">
        {signInLabel}
      </NavLink>
    </div>
  );
}
