import { useTheme } from 'next-themes';
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

import CustomButton from '@/components/Button';
import { toggleThemeAriaLabel } from '@/strings/clientStrings';

export function ThemeToggleButton(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <CustomButton
      onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={toggleThemeAriaLabel}
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </CustomButton>
  );
}
