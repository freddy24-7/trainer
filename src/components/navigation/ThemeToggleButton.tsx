import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

import { toggleThemeAriaLabel } from '@/strings/clientStrings';

export function ThemeToggleButton(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="bordered"
      className="ml-4 text-white"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={toggleThemeAriaLabel}
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </Button>
  );
}
