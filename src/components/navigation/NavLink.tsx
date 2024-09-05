'use client';

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the Props type for the NavLink component
type Props = {
  href: string; // The URL that the NavLink will navigate to
  label: string; // The text label that will be displayed in the navigation bar
};

// NavLink component definition
export default function NavLink({ href, label }: Props) {
  // Getting the current path using the usePathname hook
  const pathname = usePathname();

  return (
    <NavbarItem
      href={href} // Targeting URL for the Link
      isActive={pathname === href} // 'isActive' is true if the current path matches the href prop
      as={Link} // Rendering NavbarItem as a Link component
    >
      {label} {/* Displaying the label as the content of the NavbarItem */}
    </NavbarItem>
  );
}
