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
  statsButtonText,
  statsOptionsAriaLabel,
  matchStatsText,
  trainingStatsText,
} from '@/strings/clientStrings';
import { StatsDropdownProps } from '@/types/ui-types';

export function StatsDropdown({
  dropdownTextColor,
}: StatsDropdownProps): React.ReactElement {
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
          {statsButtonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={statsOptionsAriaLabel} variant="light">
        <DropdownItem
          key="match-stats"
          onClick={() => handleNavigation('/match-stats')} // Navigate to match stats
        >
          <span className={dropdownTextColor}>{matchStatsText}</span>
        </DropdownItem>
        <DropdownItem
          key="training-stats"
          onClick={() => handleNavigation('/training-stats')} // Navigate to training stats
        >
          <span className={dropdownTextColor}>{trainingStatsText}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
