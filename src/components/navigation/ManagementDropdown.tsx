import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import React from 'react';

import {
  managementButtonText,
  managementOptionsAriaLabel,
  playerManagementText,
  pouleManagementText,
  matchManagementText,
  trainingManagementText,
} from '@/strings/clientStrings';
import { ManagementDropdownProps } from '@/types/ui-types';

export function ManagementDropdown({
  dropdownTextColor,
}: ManagementDropdownProps): React.ReactElement {
  const router = useRouter(); // Use router for navigation

  const handleNavigation = (path: string) => {
    router.push(path); // Navigate programmatically
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className={`capitalize ${dropdownTextColor}`}
        >
          {managementButtonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={managementOptionsAriaLabel} variant="light">
        <DropdownItem
          key="player-management"
          onClick={() => handleNavigation('/player-management')} // Navigate to player management
        >
          <span className={dropdownTextColor}>{playerManagementText}</span>
        </DropdownItem>
        <DropdownItem
          key="poule-management"
          onClick={() => handleNavigation('/poule-management')} // Navigate to poule management
        >
          <span className={dropdownTextColor}>{pouleManagementText}</span>
        </DropdownItem>
        <DropdownItem
          key="match-management"
          onClick={() => handleNavigation('/matches')} // Navigate to matches
        >
          <span className={dropdownTextColor}>{matchManagementText}</span>
        </DropdownItem>
        <DropdownItem
          key="training-management"
          onClick={() => handleNavigation('/trainings')} // Navigate to trainings
        >
          <span className={dropdownTextColor}>{trainingManagementText}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
