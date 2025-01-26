import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
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
  closeMenu,
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
        <DropdownItem key="player-management" textValue={playerManagementText}>
          <Link
            href="/player-management"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {playerManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem key="poule-management" textValue={pouleManagementText}>
          <Link
            href="/poule-management"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {pouleManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem key="match-management" textValue={matchManagementText}>
          <Link
            href="/matches"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {matchManagementText}
          </Link>
        </DropdownItem>
        <DropdownItem
          key="training-management"
          textValue={trainingManagementText}
        >
          <Link
            href="/trainings"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {trainingManagementText}
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
