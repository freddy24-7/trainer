// This file contains all the types and interfaces that are used in the application.

import { CalendarDate } from '@nextui-org/react';
import { ReactNode } from 'react';

export type Team = {
  id: number;
  name: string;
};

export type PouleOpponent = {
  id: number;
  team: Team;
};

export type Poule = {
  id: number;
  pouleName: string;
  teams: Team[];
  opponents: PouleOpponent[];
};

export type Player = {
  id: number;
  username: string;
  whatsappNumber: string;
};

export type SignedInUser = {
  id: string;
  username: string;
};

export type DashboardClientProps = {
  signedInUser: SignedInUser;
};

export type DateSelectorProps = {
  matchDate: CalendarDate | null;
  onDateChange: (date: CalendarDate | null) => void;
};

export interface EditPlayerFormProps {
  playerId: number;
  initialUsername: string;
  initialWhatsappNumber: string;
  onPlayerEdited: (player: {
    id: number;
    username: string;
    whatsappNumber: string;
    whatsappLink?: string;
  }) => void;
  onSubmissionStart: () => void;
  onAbort: () => void;
}

export type OpponentSelectorProps = {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
};

export type PlayerFormData = {
  username: string;
  password: string;
  whatsappNumber: string;
};

export type PlayerFormProps = {
  initialData?: PlayerFormData;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart: () => void;
  onAbort: () => void;
  submitButtonText: string;
};

export type PlayerInputProps = {
  player: Player;
  minutes: number;
  available: boolean;
  onMinutesChange: (playerId: number, minutes: string) => void;
  onAvailabilityChange: (playerId: number, available: boolean) => void;
};

export type PlayerListProps = {
  players: Player[];
  playerMinutes: { [key: number]: number };
  playerAvailability: { [key: number]: boolean };
  onMinutesChange: (playerId: number, minutes: string) => void;
  onAvailabilityChange: (playerId: number, available: boolean) => void;
};

export type PlayerManagementClientProps = {
  players: Player[];
};

export type PlayersListProps = {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: number) => void;
};

export type PouleManagementClientProps = {
  poules: Poule[];
  onToggleForm?: () => void;
  showAddPouleForm?: boolean;
};

export type PouleSelectorProps = {
  poules: Poule[];
  selectedPoule: Poule | null;
  onPouleChange: (pouleId: number) => void;
};

export type ReusableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  confirmAction?: () => void;
  cancelLabel?: string;
  cancelAction?: () => void;
};

export type TeamsListProps = {
  teams: Team[];
  pouleName: string;
};

export type FormValues = {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
};

export type PouleFormValues = {
  pouleName: string;
  mainTeamName: string;
  opponents: string[];
  opponentName: string;
};

export type PlayerStat = {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
};

export type MatchClientProps = {
  playerStats: PlayerStat[];
};

export type MatchData = {
  id: number;
  date: Date;
  opponentTeamName: string;
  absentPlayers: string[];
};

export type OpponentClientProps = {
  matchData: MatchData[];
};

export type NavLinkProps = {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
};

export type NavBarClientProps = {
  userId: string | null;
  userRole: string | null;
};

export type TrainingFormValues = {
  date: CalendarDate | null;
  players: { userId: number; absent: boolean }[];
};

export type PlayerAttendance = {
  playerId: number;
  username: string;
  absences: number;
};

export type TrainingAttendanceClientProps = {
  attendanceList: PlayerAttendance[];
};

export type TrainingData = {
  id: number;
  date: string;
  absentPlayers: string[];
};

export type TrainingClientProps = {
  trainingData: TrainingData[];
};

export type GetTrainingDataResponse =
  | { success: true; trainingData: TrainingData[] }
  | { success: false; error: string };

export type GetTrainingAttendanceListResponse =
  | { success: true; attendanceList: PlayerAttendance[] }
  | { success: false; error: string };

export type PlayerMatchStat = {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
};

export type GetPlayerMatchStatsResponse =
  | { success: true; playerStats: PlayerMatchStat[] }
  | { success: false; error: string };

export type GetMatchDataResponse =
  | { success: true; matchData: MatchData[] }
  | { success: false; error: string };
