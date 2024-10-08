import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { IoFootball } from 'react-icons/io5';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';

import NavBarClient from './NavBarClient';

export default async function NavBar(): Promise<ReactElement> {
  const signedInUser = await fetchAndCheckUser();

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

      <NavBarClient
        userId={signedInUser?.id || null}
        userRole={signedInUser?.role || null}
      />
    </Navbar>
  );
}
