// This file contains all the types and interfaces that are used in the application.

import { CalendarDate } from '@nextui-org/react';
import { ReactNode } from 'react';

export interface Team {
  id: number;
  name: string;
}

export interface PouleOpponent {
  id: number;
  team: Team;
}

export interface Poule {
  id: number;
  pouleName: string;
  teams: Team[];
  opponents: PouleOpponent[];
}

export interface Player {
  id: number;
  username: string;
}

export type SignedInUser = {
  id: string;
  username: string;
};

export interface DashboardClientProps {
  signedInUser: SignedInUser;
}

export interface DateSelectorProps {
  matchDate: CalendarDate | null;
  onDateChange: (date: CalendarDate | null) => void;
}

export interface EditPlayerFormProps {
  playerId: number;
  initialUsername: string;
  onPlayerEdited: (updatedPlayer: { id: number; username: string }) => void;
  onSubmissionStart: () => void;
  onAbort: () => void;
}

export interface OpponentSelectorProps {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
}

export interface PlayerFormData {
  username: string;
  password: string;
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

export interface PlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: number) => void;
}

export interface Team {
  id: number;
  name: string;
}

export interface Poule {
  pouleName: string;
  teams: Team[];
}

export interface PouleManagementClientProps {
  poules: Poule[];
  onToggleForm?: () => void;
  showAddPouleForm?: boolean;
}

export interface PouleSelectorProps {
  poules: Poule[];
  selectedPoule: Poule | null;
  onPouleChange: (pouleId: number) => void;
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

export interface Team {
  id: number;
  name: string;
}

export interface TeamsListProps {
  teams: Team[];
  pouleName: string;
}
