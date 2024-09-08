'use client';

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

// Define the Props type for the NavLink component
type Props = {
  href: string; // The URL that the NavLink will navigate to
  label?: string; // Optional text label to display in the navigation bar
  children?: ReactNode; // Children to render inside the link, e.g., icons, text
  className?: string; // Optional className for additional styling
};

// NavLink component definition
export default function NavLink({ href, label, children, className }: Props) {
  // Getting the current path using the usePathname hook
  const pathname = usePathname();

  return (
    <NavbarItem
      href={href} // Targeting URL for the Link
      isActive={pathname === href} // 'isActive' is true if the current path matches the href prop
      as={Link} // Rendering NavbarItem as a Link component
      className={className} // Passing className for additional styling
    >
      {children || label} {/* Displaying children or label if provided */}
    </NavbarItem>
  );
}
