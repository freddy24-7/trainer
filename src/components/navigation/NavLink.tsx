'use client';

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';

import { NavLinkProps } from '@/types/types';

export default function NavLink({
  href,
  label,
  children,
  className,
}: NavLinkProps): ReactElement {
  const pathname = usePathname();

  return (
    <NavbarItem
      href={href}
      isActive={pathname === href}
      as={Link}
      className={className}
    >
      {children || label}
    </NavbarItem>
  );
}
