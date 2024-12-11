import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import Link from 'next/link';
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
        <DropdownItem key="player-management">
          <Link href="/player-management" className={dropdownTextColor}>
            {playerManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem key="poule-management">
          <Link href="/poule-management" className={dropdownTextColor}>
            {pouleManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem key="match-management">
          <Link href="/matches" className={dropdownTextColor}>
            {matchManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem key="training-management">
          <Link href="/trainings" className={dropdownTextColor}>
            {trainingManagementText}
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
