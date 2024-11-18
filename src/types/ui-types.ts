import { CalendarDate } from '@nextui-org/react';
import { ReactNode } from 'react';

export interface DateSelectorProps {
  matchDate: CalendarDate | null;
  onDateChange: (date: CalendarDate | null) => void;
}

export interface NavBarClientProps {
  userId: number | null;
  userRole: string | null;
}

export interface NavLinkProps {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
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
}

export interface MobileMenuProps {
  userId: number | null;
  userRole: string | null;
  dropdownTextColor: string;
}

export interface NavBarUserContentProps {
  userId: number | null;
  userRole: string | null;
  dropdownTextColor: string;
}

export interface StatsDropdownProps {
  dropdownTextColor: string;
}
