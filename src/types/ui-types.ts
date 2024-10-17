import { CalendarDate } from '@nextui-org/react';
import { ReactNode } from 'react';
import { PouleOpponent } from './poule-types';
import { SignedInUser } from './user-types';
import { PlayerFormData } from './user-types';

export interface DateSelectorProps {
  matchDate: CalendarDate | null;
  onDateChange: (date: CalendarDate | null) => void;
}

export interface NavBarClientProps {
  userId: string | null;
  userRole: string | null;
}

export interface NavLinkProps {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
}

export interface OpponentSelectorProps {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
}

export interface PlayerFormProps {
  initialData?: PlayerFormData;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart: () => void;
  onAbort: () => void;
  submitButtonText: string;
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
