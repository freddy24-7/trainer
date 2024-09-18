// This component is used to enable user interaction with the application.
'use client';

import {
  Button,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import Link from 'next/link';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { CiHome } from 'react-icons/ci';
import NavLink from '@/components/navigation/NavLink';
import { NavBarClientProps } from '@/lib/types';

export default function NavBarClient({ userId, userRole }: NavBarClientProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Boilerplate section used for theme change (Icon)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dropdownTextColor = theme === 'light' ? 'text-black' : 'text-white';

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
        <NavLink href="/">
          <CiHome size={24} className="ml-2" />
        </NavLink>
        <Button
          variant="bordered"
          className="ml-4 text-white"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
        {userId ? (
          <div className="flex gap-4 items-center">
            {/* Management Dropdown for TRAINER role */}
            {userRole === 'TRAINER' && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className={`capitalize ${dropdownTextColor}`}
                  >
                    Management
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Management Options" variant="light">
                  <DropdownItem key="player-management">
                    <Link
                      href="/player-management"
                      className={dropdownTextColor}
                    >
                      Player-Management
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="poule-management">
                    <Link
                      href="/poule-management"
                      className={dropdownTextColor}
                    >
                      Poule-Management
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="match-management">
                    <Link href="/matches" className={dropdownTextColor}>
                      Match-Management
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="training-management">
                    <Link href="/trainings" className={dropdownTextColor}>
                      Training-Management
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            {/* Stats Dropdown for TRAINER role */}
            {userRole === 'TRAINER' && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className={`capitalize ${dropdownTextColor}`}
                  >
                    Stats
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Stats Options" variant="light">
                  <DropdownItem key="match-stats">
                    <Link href="/match-stats" className={dropdownTextColor}>
                      Match-Stats
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="training-stats">
                    <Link href="/training-stats" className={dropdownTextColor}>
                      Training-Stats
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            <NavLink href="/dashboard" className="text-white">
              Dashboard
            </NavLink>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <NavLink href="/sign-up" className="text-gray-700">
              Sign up
            </NavLink>
            <NavLink href="/sign-in" className="text-gray-700">
              Sign In
            </NavLink>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu Dropdown - Visible when menuOpen is true */}
      {menuOpen && (
        <div className="flex flex-col items-center bg-brandcolor w-auto py-4 mt-12">
          <div className="h-72 mr-7"></div>
          <Link href="/" className="text-white w-auto my-2 flex items-center">
            <CiHome size={24} />
            <span className="ml-2">Home</span>
          </Link>
          <Button
            variant="bordered"
            className="text-white w-auto my-2"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </Button>
          {userId ? (
            <div className="flex flex-col items-center">
              {/* Management Links for Mobile Menu */}
              {userRole === 'TRAINER' && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className={`capitalize ${dropdownTextColor} w-auto my-2`}
                    >
                      Management
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Management Options" variant="light">
                    <DropdownItem key="player-management">
                      <Link
                        href="/player-management"
                        className={dropdownTextColor}
                      >
                        Player-Management
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="poule-management">
                      <Link
                        href="/poule-management"
                        className={dropdownTextColor}
                      >
                        Poule-Management
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="match-management">
                      <Link href="/matches" className={dropdownTextColor}>
                        Match-Management
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="training-management">
                      <Link href="/trainings" className={dropdownTextColor}>
                        Match-Management
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
              {/* Stats Dropdown for Mobile Menu */}
              {userRole === 'TRAINER' && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className={`capitalize ${dropdownTextColor} w-auto my-2`}
                    >
                      Stats
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Stats Options" variant="light">
                    <DropdownItem key="match-stats">
                      <Link href="/match-stats" className={dropdownTextColor}>
                        Match-Stats
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="training-stats">
                      <Link
                        href="/training-stats"
                        className={dropdownTextColor}
                      >
                        Training-Stats
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
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
