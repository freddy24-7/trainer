'use client';

import { Button, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react';
import Link from 'next/link';
import { IoFootball } from 'react-icons/io5';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import NavLink from './NavLink';

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to control the mobile menu
  const { theme, setTheme } = useTheme();

  // Boilerplate section used for theme change
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

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

      {/* Mobile Menu Button - Visible on small screens */}
      <div className="md:hidden flex items-center w-min ">
        <Button
          variant="bordered"
          className="text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}{' '}
          {/* Toggling between FiMenu and FiX */}
        </Button>
      </div>

      {/* Centered content for navigation links - Hidden on small screens */}
      {/*<NavbarContent justify='center' className="hidden md:flex">*/}
      {/*    <NavLink href='/trainers' label='Trainers'/>*/}
      {/*    <NavLink href='/players' label='Players'/>*/}
      {/*    <NavLink href='/messages' label='Messages'/>*/}
      {/*    <NavLink href='/chat' label='Chat'/>*/}
      {/*</NavbarContent>*/}

      {/* Right-aligned content for login and register buttons */}
      <NavbarContent justify="end" className="hidden md:flex">
        {/*<Button*/}
        {/*  as={Link}*/}
        {/*  href="/login"*/}
        {/*  variant="bordered"*/}
        {/*  className="text-white"*/}
        {/*>*/}
        {/*  Login*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*  as={Link}*/}
        {/*  href="/register"*/}
        {/*  variant="bordered"*/}
        {/*  className="text-white"*/}
        {/*>*/}
        {/*  Register*/}
        {/*</Button>*/}
        <Button
          variant="bordered"
          className="ml-4 text-white"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
      </NavbarContent>

      {/* Mobile Menu Dropdown - Visible when menuOpen is true */}
      {menuOpen && (
        <div className="flex flex-col items-center bg-brandcolor w-auto py-4 mt-12">
          <div className="h-72 mr-7"></div>
          {/* Convert NavLinks to Buttons in Mobile Menu */}
          {/*<Button as={Link} href='/trainers' variant='ghost' className='text-white w-auto my-2'>*/}
          {/*    Trainers*/}
          {/*</Button>*/}
          {/*<Button as={Link} href='/players' variant='ghost' className='text-white w-auto my-2'>*/}
          {/*    Players*/}
          {/*</Button>*/}
          {/*<Button as={Link} href='/messages' variant='ghost' className='text-white w-auto my-2'>*/}
          {/*    Messages*/}
          {/*</Button>*/}
          {/*<Button as={Link} href='/chat' variant='ghost' className='text-white w-auto my-2'>*/}
          {/*    Chat*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  as={Link}*/}
          {/*  href="/login"*/}
          {/*  variant="bordered"*/}
          {/*  className="text-white w-auto my-2"*/}
          {/*>*/}
          {/*  Login*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  as={Link}*/}
          {/*  href="/register"*/}
          {/*  variant="bordered"*/}
          {/*  className="text-white w-auto my-2"*/}
          {/*>*/}
          {/*  Register*/}
          {/*</Button>*/}
          <Button
            variant="bordered"
            className="text-white w-auto my-2"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </Button>
        </div>
      )}
    </Navbar>
  );
}
