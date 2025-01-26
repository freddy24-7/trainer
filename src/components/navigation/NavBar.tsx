'use client';

import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { IoFootball } from 'react-icons/io5';

import NavBarClient from '@/components/navigation/NavBarClient';
import { SignedInUser } from '@/types/user-types';

interface NavBarProps {
  user: SignedInUser | null;
}

export default function NavBar({ user }: NavBarProps): React.ReactElement {
  const { id: userId, role: userRole = null } = user || {
    id: null,
    role: null,
  };

  return (
    <Navbar
      maxWidth="full"
      className="bg-gradient-to-br from-[var(--brandcolor-light)] via-[var(--brandcolor)] to-[var(--brandcolor-dark)] px-4 py-2"
    >
      <NavbarBrand as={Link} href="/" className="flex items-center space-x-2">
        <IoFootball size={28} className="text-gray-700" />
        <div className="hidden sm:flex font-bold text-lg">
          <span className="text-gray-700">Club</span>
          <span className="text-gray-100">Trainer</span>
        </div>
      </NavbarBrand>

      {userId ? (
        <NavBarClient userId={userId} userRole={userRole} />
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/sign-in" prefetch={false} className="text-white text-xl">
            Sign In
          </Link>
        </div>
      )}
    </Navbar>
  );
}
