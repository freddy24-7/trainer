'use client';

import { NavbarContent } from '@heroui/react';
import { useTheme } from 'next-themes';
import React, { useState, useEffect, ReactElement } from 'react';
import { CiHome } from 'react-icons/ci';

import NavLink from '@/components/navigation/NavLink';
import { homeLabel } from '@/strings/clientStrings';
import { NavBarClientProps } from '@/types/ui-types';

import { MobileMenu } from './MobileMenu';
import { NavBarUserContent } from './NavBarUserContent';
import { ThemeToggleButton } from './ThemeToggleButton';

export default function NavBarClient({
  userId,
  userRole,
}: NavBarClientProps): ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dropdownTextColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <>
      <div className="md:hidden flex items-center w-min">
        <MobileMenu
          userId={userId}
          userRole={userRole}
          dropdownTextColor={dropdownTextColor}
        />
      </div>

      <NavbarContent justify="end" className="hidden md:flex">
        <NavLink href="/" aria-label={homeLabel}>
          <CiHome size={24} className="ml-2" />
        </NavLink>
        <ThemeToggleButton />
        <NavBarUserContent
          userId={userId}
          userRole={userRole}
          dropdownTextColor={dropdownTextColor}
        />
      </NavbarContent>
    </>
  );
}
