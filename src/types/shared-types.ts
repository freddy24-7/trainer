import { ButtonProps } from '@heroui/react';
import React, { ReactNode } from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { MatchData } from '@/types/match-types';
import { PouleFormValues } from '@/types/poule-types';

export interface OpponentClientProps {
  matchData: MatchData[];
}

export interface ResponseError {
  message?: string;
}

export interface ActionResponse {
  success: boolean;
  errors?: ZodIssue[];
  videoUrl?: string | null;
  messageId?: number;
}

export interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole: string;
}

export interface InputFieldProps {
  name: keyof PouleFormValues;
  control: Control<PouleFormValues>;
  placeholder: string;
  errors: FieldErrors<PouleFormValues>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface OpponentsListProps {
  opponents: string[];
  onRemove: (index: number) => void;
}

export interface ModalSetupParams {
  setModalTitle: React.Dispatch<React.SetStateAction<string>>;
  setModalBody: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LoadingSpinnerProps {
  label?: string;
  color?: 'primary' | 'success' | 'danger' | 'warning';
  labelColor?: 'primary' | 'success' | 'danger' | 'warning';
}

export interface DateFieldProps {
  name: string;
  label: string;
  errors?: Record<string, unknown>;
}

export interface DateFilterProps {
  onFilter: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
}

export interface CustomButtonProps extends Omit<ButtonProps, 'onPress'> {
  children: ReactNode;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export interface FutureDateWarningProps {
  isFutureDate: boolean;
  showToast?: boolean;
}
