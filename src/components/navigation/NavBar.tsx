// //This component is responsible for rendering the navigation bar at the top of the page.
import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import { IoFootball } from 'react-icons/io5';
import { auth } from '@clerk/nextjs';
import NavBarClient from './NavBarClient'; // Client Component
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function NavBar() {
  // Fetching the current user's ID from Clerk's auth module
  const { userId } = auth();

  let userRole = null;

  // Fetching the user's role from the database if the user is authenticated
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    userRole = user?.role || null;
  }

  return (
    <Navbar
      maxWidth="full"
      className="bg-brandcolor"
      classNames={{
        item: ['text-xl', 'text-white', 'data-[active=true]:text-red-600'],
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

      {/* Passing userId and userRole to NavBarClient */}
      <NavBarClient userId={userId} userRole={userRole} />
    </Navbar>
  );
}
