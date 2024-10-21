import { CalendarDate } from '@nextui-org/react';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { ResponseError } from '@/types/response-types';

export interface FormValues {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
}

export interface DashboardClientProps {
  signedInUser: SignedInUser;
}

export interface Player {
  id: number;
  username: string;
  whatsappNumber: string;
}

export interface PlayerAtTraining {
  userId: number;
  absent: boolean;
}

export interface PlayerFormData {
  username: string;
  password: string;
  whatsappNumber: string;
}

export interface PlayerFormProps {
  initialData?: PlayerFormData;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart: () => void;
  onAbort: () => void;
  submitButtonText: string;
}

export interface PlayerInputProps {
  player: Player;
  minutes: number;
  available: boolean;
  onMinutesChange: (playerId: number, minutes: string) => void;
  onAvailabilityChange: (playerId: number, available: boolean) => void;
}

export interface PlayerListProps {
  players: Player[];
  playerMinutes: { [key: number]: number };
  playerAvailability: { [key: number]: boolean };
  onMinutesChange: (playerId: number, minutes: string) => void;
  onAvailabilityChange: (playerId: number, available: boolean) => void;
}

export interface PlayerManagementClientProps {
  players: Player[];
}

export interface PlayerMatchStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
}

export interface PlayerResponse {
  id: number;
  username?: string;
  whatsappNumber?: string;
}

export interface PlayerStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
}

export interface PlayerStatsTableProps {
  playerStats: PlayerStat[];
}

export interface SignedInUser {
  id: string;
  username: string;
  role?: string;
}

export interface PlayersFieldProps {
  players: Player[];
  playerValues: FormValues['players'];
  setValue: UseFormSetValue<FormValues>;
}

export interface UserData {
  clerkId: string;
  username: string;
  role: string;
}

export interface PlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: number) => void;
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

export interface EditPlayerFormData {
  username: string;
  password?: string;
  whatsappNumber: string;
}

export interface PlayerResponseData {
  success: boolean;
  players?: PlayerResponse[];
  errors?: (ResponseError | ZodIssue)[];
}
