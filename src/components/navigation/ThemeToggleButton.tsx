import { Button } from '@heroui/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

import { toggleThemeAriaLabel } from '@/strings/clientStrings';

export function ThemeToggleButton(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={toggleThemeAriaLabel}
      className="ml-4 border border-white rounded text-white px-4 py-2 flex items-center"
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </Button>
  );
}
