import { Button, ButtonProps } from '@heroui/react';
import React, { FC, ReactNode } from 'react';

interface CustomButtonProps extends Omit<ButtonProps, 'onPress'> {
  children: ReactNode;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const CustomButton: FC<CustomButtonProps> = ({
  children,
  onPress,
  type = 'button',
  disabled = false,
  className = 'bg-gradient-to-br from-[var(--brandcolor-light)] via-[var(--brandcolor)] to-[var(--brandcolor-dark)] px-4 py-2 text-white rounded',
  ...rest
}) => {
  return (
    <Button
      onPress={onPress}
      type={type}
      disabled={disabled}
      className={`custom-button ${className}`}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
