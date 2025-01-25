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

export class StatsDropdown extends React.Component<StatsDropdownProps> {
  render(): React.ReactElement {
    let { dropdownTextColor, closeMenu } = this.props;
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
          <DropdownItem key="match-stats" textValue={matchStatsText}>
            <Link
              href="/match-stats"
              className={dropdownTextColor}
              onClick={closeMenu}
            >
              {matchStatsText}
            </Link>
          </DropdownItem>
          <DropdownItem key="training-stats" textValue={trainingStatsText}>
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
}
