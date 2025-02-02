import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleClick = (path: string) => {
    closeMenu();
    router.push(path);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className={`capitalize ${dropdownTextColor}`}>
          {managementButtonText}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label={managementOptionsAriaLabel} variant="light">
        <DropdownItem
          key="player-management"
          textValue={playerManagementText}
          onPress={() => handleClick('/player-management')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {playerManagementText}
        </DropdownItem>
        <DropdownItem
          key="poule-management"
          textValue={pouleManagementText}
          onPress={() => handleClick('/poule-management')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {pouleManagementText}
        </DropdownItem>
        <DropdownItem
          key="match-management"
          textValue={matchManagementText}
          onPress={() => handleClick('/matches')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {matchManagementText}
        </DropdownItem>
        <DropdownItem
          key="training-management"
          textValue={trainingManagementText}
          onPress={() => handleClick('/trainings')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {trainingManagementText}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
