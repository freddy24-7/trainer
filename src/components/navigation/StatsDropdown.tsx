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
        <DropdownItem key="match-stats">
          <Link
            href="/match-stats"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {matchStatsText}
          </Link>
        </DropdownItem>
        <DropdownItem key="training-stats">
          <Link
            href="/training-stats"
            className={dropdownTextColor}
            onClick={closeMenu}
          >
            {trainingStatsText}
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
