import React from 'react';
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
  initialWhatsappNumber?: string;
  onPlayerEdited: (updatedPlayer: {
    id: number;
    username: string;
    whatsappNumber?: string;
    whatsappLink?: string;
  }) => void;
  onSubmissionStart?: () => void;
  onAbort?: () => void;
  onCloseModal: () => void;
}

export interface FormValues {
  matchType: 'competition' | 'practice';
  poule: number | undefined;
  opponent: number | undefined;
  opponentName: string;
  date: string | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  matchEvents?: {
    playerInId?: number | null;
    playerOutId?: number | null;
    playerId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION' | 'GOAL' | 'ASSIST';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
}

export interface DashboardClientProps {
  signedInUser: SignedInUser;
}

export interface Player {
  id: number;
  username: string;
  whatsappNumber?: string;
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
  whatsappNumber?: string;
}

export interface PlayerFormProps {
  initialData?: PlayerFormData;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart: () => void;
  onAbort: () => void;
  submitButtonText: string;
}

export interface PlayerManagementClientProps {
  players: Player[];
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

export interface SignedInUser {
  id: string;
  username: string;
  role: string | null;
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
  whatsappNumber?: string;
}

export interface PlayerResponseData {
  success: boolean;
  players?: PlayerResponse[];
  errors?: (ResponseError | ZodIssue)[];
}

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
  initialWhatsappNumber?: string;
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
  name?: string;
  autocomplete?: string;
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

export type GetPlayerMatchStatsResponse =
  | { success: true; playerStats: PlayerMatchOwnStat[] }
  | { success: false; error: string };

interface PlayerMatchOwnStat {
  id: number;
  username: string;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
  matchData?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
  }[];
}

export interface MatchDataEntry {
  id: number;
  matchId: number;
  userId: number;
  minutes: number;
  available: boolean;
  match: {
    id: number;
    date: string;
    opponentStrength: string | null;
  };
}
