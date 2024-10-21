import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

interface ManagementDropdownProps {
  dropdownTextColor: string;
}

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
          Management
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Management Options" variant="light">
        <DropdownItem key="player-management">
          <Link href="/player-management" className={dropdownTextColor}>
            Player-Management
          </Link>
        </DropdownItem>
        <DropdownItem key="poule-management">
          <Link href="/poule-management" className={dropdownTextColor}>
            Poule-Management
          </Link>
        </DropdownItem>
        <DropdownItem key="match-management">
          <Link href="/matches" className={dropdownTextColor}>
            Match-Management
          </Link>
        </DropdownItem>
        <DropdownItem key="training-management">
          <Link href="/trainings" className={dropdownTextColor}>
            Training-Management
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
