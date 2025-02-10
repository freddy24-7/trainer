import { ReactNode } from 'react';

export interface NavBarClientProps {
  userId: string | null;
  userRole: string | null;
}

export interface NavLinkProps {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  confirmAction?: () => void;
  cancelLabel?: string;
  cancelAction?: () => void;
}

export interface ManagementDropdownProps {
  dropdownTextColor: string;
  closeMenu: () => void;
}

export interface MobileMenuProps {
  userId: string | null;
  userRole: string | null;
  dropdownTextColor: string;
}

export interface NavBarUserContentProps {
  userId: string | null;
  userRole: string | null;
  dropdownTextColor: string;
  stacked?: boolean;
  closeMenu?: () => void;
}

export interface StatsDropdownProps {
  dropdownTextColor: string;
  closeMenu: () => void;
}

export interface DisableButtonOptions {
  isSubmitting: boolean;
  isFutureDate?: boolean;
  isFormValid: boolean;
}

export interface DisableButtonResult {
  isButtonDisabled: boolean;
  buttonClassName: string;
}
