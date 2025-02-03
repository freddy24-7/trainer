import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  statsButtonText,
  statsOptionsAriaLabel,
  matchStatsText,
  trainingStatsText,
} from '@/strings/clientStrings';
import { StatsDropdownProps } from '@/types/ui-types';

export function StatsDropdown({
  dropdownTextColor,
  closeMenu,
}: StatsDropdownProps): React.ReactElement {
  const router = useRouter();

  const handleClick = (path: string): void => {
    closeMenu();
    router.push(path);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className={`capitalize ${dropdownTextColor}`}>
          {statsButtonText}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label={statsOptionsAriaLabel} variant="light">
        <DropdownItem
          key="match-stats"
          textValue={matchStatsText}
          onPress={() => handleClick('/match-stats')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {matchStatsText}
        </DropdownItem>
        <DropdownItem
          key="training-stats"
          textValue={trainingStatsText}
          onPress={() => handleClick('/training-stats')}
          className={`w-full px-2 py-1 ${dropdownTextColor}`}
        >
          {trainingStatsText}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
