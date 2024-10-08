'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState, ReactElement } from 'react';

import { NavBarClientProps } from '@/types/types';

import DesktopNavbarContent from './DesktopNavbarContent';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';

export default function NavBarClient({
  userId,
  userRole,
}: NavBarClientProps): ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dropdownTextColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <>
      <MobileMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <DesktopNavbarContent
        userId={userId}
        userRole={userRole}
        dropdownTextColor={dropdownTextColor}
      />

      <MobileMenu
        userId={userId}
        userRole={userRole}
        menuOpen={menuOpen}
        dropdownTextColor={dropdownTextColor}
      />
    </>
  );
}
