//This component is responsible for rendering the navigation bar at the top of the page.
import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import { IoFootball } from 'react-icons/io5';
import { auth } from '@clerk/nextjs';
import NavBarClient from './NavBarClient';

export default function NavBar() {
  const { userId } = auth();

  return (
    <Navbar
      maxWidth="full"
      className="bg-brandcolor"
      classNames={{
        item: [
          'text-xl',
          'text-white',
          'uppercase',
          'data-[active=true]:text-red-600',
        ],
      }}
    >
      {/* NavbarBrand represents the brand section of the Navbar */}
      <NavbarBrand as={Link} href="/">
        <IoFootball size={35} className="text-gray-700" />
        <div className="hidden lg:flex font-bold text-2xl">
          <span className="text-gray-700">Club</span>
          <span className="text-gray-100">Trainer</span>
        </div>
      </NavbarBrand>

      {/* Passing userId to NavBarClient to handle state and interactions */}
      <NavBarClient userId={userId} />
    </Navbar>
  );
}
