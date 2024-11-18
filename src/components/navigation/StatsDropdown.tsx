import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

import { StatsDropdownProps } from '@/types/ui-types';

export function StatsDropdown({
  dropdownTextColor,
}: StatsDropdownProps): React.ReactElement {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className={`capitalize ${dropdownTextColor}`}
        >
          Stats
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Stats Options" variant="light">
        <DropdownItem key="match-stats">
          <Link href="/match-stats" className={dropdownTextColor}>
            Match-Stats
          </Link>
        </DropdownItem>
        <DropdownItem key="training-stats">
          <Link href="/training-stats" className={dropdownTextColor}>
            Training-Stats
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
