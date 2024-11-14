import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { CiHome } from 'react-icons/ci';
import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';

import { ManagementDropdown } from '@/components/navigation/ManagementDropdown';
import { StatsDropdown } from '@/components/navigation/StatsDropdown';

interface MobileMenuProps {
  userId: number | null;
  userRole: string | null;
  dropdownTextColor: string;
}

export function MobileMenu({
  userId,
  userRole,
  dropdownTextColor,
}: MobileMenuProps): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Button
        variant="bordered"
        className="text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </Button>

      {menuOpen && (
        <div className="flex flex-col items-center bg-brandcolor w-auto py-4 mt-12">
          <Link href="/" className="text-white w-auto my-2 flex items-center">
            <CiHome size={24} />
            <span className="ml-2">Home</span>
          </Link>
          <Button
            variant="bordered"
            className="text-white w-auto my-2"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </Button>
          {userId && userRole === 'TRAINER' && (
            <>
              <ManagementDropdown dropdownTextColor={dropdownTextColor} />
              <StatsDropdown dropdownTextColor={dropdownTextColor} />
            </>
          )}
        </div>
      )}
    </>
  );
}
