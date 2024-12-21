import { CalendarDate } from '@nextui-org/react';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { ResponseError } from './shared-types';

export interface DisplayPlayersProps extends PlayerManagementClientProps {
  editPlayerAction: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
  deletePlayerAction: (
    playerId: number
  ) => Promise<{ success: boolean; errors?: string }>;
}

export interface EditPlayerFormProps {
  playerId: number;
  action: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
  initialUsername: string;
  initialWhatsappNumber: string;
  onPlayerEdited: (updatedPlayer: {
    id: number;
    username: string;
    whatsappNumber: string;
    whatsappLink: string;
  }) => void;
  onSubmissionStart?: () => void;
  onAbort?: () => void;
  onCloseModal: () => void;
}

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

export interface ChatUser {
  id: number;
  username: string;
  whatsappNumber?: string;
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

export interface UserResponse {
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
  role: string | null;
}

export interface PlayersFieldProps {
  players: Player[];
  playerValues: FormValues['players'];
  setValue: UseFormSetValue<FormValues>;
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

export type GetPlayerMatchStatsResponse =
  | { success: true; playerStats: PlayerMatchStat[] }
  | { success: false; error: string };

export interface ClerkUser {
  id: string;
  username: string | null;
}

export type UpdateUsernameResult =
  | { success: true }
  | { errors: ZodIssue[]; success?: false };

export interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  modalBody: React.ReactNode;
  editPlayerData: Player | null;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlayerEdited: (updatedPlayer: Player) => void;
  editPlayerAction: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
  confirmAction?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelAction?: () => void;
}

export interface RenderPlayerFormProps {
  formKey: number;
  initialUsername: string;
  initialWhatsappNumber: string;
  isSubmitting: boolean;
  playerData: PlayerFormData | null;
  handleEditPlayer: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart?: () => void;
  onAbort?: () => void;
}

export interface PlayerFormInputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export interface ExtendedPlayersListProps {
  players: Player[];
  showGroupChatOption?: boolean;
  onSelect?: (id: number | null) => void;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: number) => void;
}

export interface PlayerApiResponse {
  success?: boolean;
  players?: PlayerResponse[];
  errors?: (ResponseError | ZodIssue)[];
}
