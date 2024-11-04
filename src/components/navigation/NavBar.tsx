import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { IoFootball } from 'react-icons/io5';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';

import NavBarClient from './NavBarClient';

export default async function NavBar(): Promise<React.ReactElement> {
  const user = await fetchAndCheckUser();

  const { id: userId, role: userRole = null } = user || {
    id: null,
    role: null,
  };

  return (
    <Navbar
      maxWidth="full"
      className="bg-brandcolor"
      classNames={{
        item: ['text-xl', 'text-white', 'data-[active=true]:text-red-600'],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <IoFootball size={35} className="text-gray-700" />
        <div className="hidden lg:flex font-bold text-2xl">
          <span className="text-gray-700">Club</span>
          <span className="text-gray-100">Trainer</span>
        </div>
      </NavbarBrand>

      {userId ? (
        <NavBarClient userId={userId} userRole={userRole} />
      ) : (
        <div className="flex items-center space-x-4">
          <Link href="/sign-in" className="text-white text-xl">
            Sign In
          </Link>
        </div>
      )}
    </Navbar>
  );
}
