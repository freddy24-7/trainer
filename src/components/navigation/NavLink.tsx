'use client';

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { NavLinkProps } from '@/types/ui-types';

export default function NavLink({
  href,
  label,
  children,
  className,
  onClick,
}: NavLinkProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <NavbarItem
      href={href}
      isActive={pathname === href}
      as={Link}
      className={className}
      onClick={onClick}
    >
      {children || label}
    </NavbarItem>
  );
}
