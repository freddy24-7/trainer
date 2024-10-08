import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React, { ReactElement } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggleButton(): ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="bordered"
      className="text-white"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </Button>
  );
}
