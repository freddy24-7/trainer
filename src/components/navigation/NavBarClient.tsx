//This component is used to enable user interaction with the application.
'use client';

import { Button, NavbarContent } from '@nextui-org/react';
import Link from 'next/link';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';

type NavBarClientProps = {
  userId: string | null;
};

export default function NavBarClient({ userId }: NavBarClientProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to control the mobile menu
  const { theme, setTheme } = useTheme();

  // Boilerplate section used for theme change
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Button - Visible on small screens */}
      <div className="md:hidden flex items-center w-min">
        <Button
          variant="bordered"
          className="text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </Button>
      </div>

      {/* Right-aligned content for login, register, and theme toggle buttons */}
      <NavbarContent justify="end" className="hidden md:flex">
        <Button
          variant="bordered"
          className="ml-4 text-white"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
        {userId ? (
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-white">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link href="/sign-up" className="text-gray-700">
              Sign up
            </Link>
            <Link href="/sign-in" className="text-gray-700">
              Sign In
            </Link>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu Dropdown - Visible when menuOpen is true */}
      {menuOpen && (
        <div className="flex flex-col items-center bg-brandcolor w-auto py-4 mt-12">
          <div className="h-72 mr-7"></div>
          <Button
            variant="bordered"
            className="text-white w-auto my-2"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </Button>
          {userId ? (
            <div className="flex flex-col items-center">
              <Link href="/dashboard" className="text-white w-auto my-2">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Link href="/sign-up" className="text-white w-auto my-2">
                Sign up
              </Link>
              <Link href="/sign-in" className="text-white w-auto my-2">
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}