'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import CustomButton from '@/components/Button';

interface ThemeToggleButtonProps {
  onPress?: () => void;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  onPress,
}) => {
  const { theme, setTheme } = useTheme();

  const handleClick = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    if (onPress) onPress();
  };

  return (
    <CustomButton onPress={handleClick}>
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </CustomButton>
  );
};
