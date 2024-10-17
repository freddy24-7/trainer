import React from 'react';
import { PlayerFormData } from './user-types';
import { CalendarDate } from '@nextui-org/react';
import { ZodIssue } from 'zod';

export interface FormValues {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
}

export interface HandlePlayerFormSubmitParams {
  data: PlayerFormData;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  validationFunction: (formData: FormData) => {
    success: boolean;
    errors?: ZodIssue[];
  };
  actionFunction: (formData: FormData) => Promise<{ errors: ZodIssue[] }>;
  onSuccess: (playerData: PlayerFormData) => void;
}
