// This component is used to display navigation links.

'use client';

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLinkProps } from '@/lib/types';

export default function NavLink({
  href,
  label,
  children,
  className,
}: NavLinkProps) {
  // Getting the current path using the usePathname hook
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
