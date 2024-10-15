import { CalendarDate } from '@nextui-org/react';
import React, { ReactNode } from 'react';
import { ZodIssue } from 'zod';
import { UseFormSetValue } from 'react-hook-form';

export interface UserData {
  clerkId: string;
  username: string;
  role: string;
}

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
  whatsappNumber: string;
}

export interface DashboardClientProps {
  signedInUser: SignedInUser;
}

export interface DateSelectorProps {
  matchDate: CalendarDate | null;
  onDateChange: (date: CalendarDate | null) => void;
}

export interface OpponentSelectorProps {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
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

export interface PlayersListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: number) => void;
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

export interface TeamsListProps {
  teams: Team[];
  pouleName: string;
}

export interface FormValues {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
}

export interface PouleFormValues {
  pouleName: string;
  mainTeamName: string;
  opponents: string[];
  opponentName: string;
}

export interface PlayerStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
}

export interface MatchClientProps {
  playerStats: PlayerStat[];
}

export interface MatchData {
  id: number;
  date: Date;
  opponentTeamName: string;
  absentPlayers: string[];
}

export interface OpponentClientProps {
  matchData: MatchData[];
}

export interface NavLinkProps {
  href: string;
  label?: string;
  children?: ReactNode;
  className?: string;
}

export interface NavBarClientProps {
  userId: string | null;
  userRole: string | null;
}

export interface TrainingFormValues {
  date: CalendarDate | null;
  players: { userId: number; absent: boolean }[];
}

export interface PlayerAttendance {
  playerId: number;
  username: string;
  absences: number;
}

export interface TrainingAttendanceClientProps {
  attendanceList: PlayerAttendance[];
}

export interface TrainingData {
  id: number;
  date: string;
  absentPlayers: string[];
}

export interface TrainingClientProps {
  trainingData: TrainingData[];
}

export type GetTrainingDataResponse =
  | { success: true; trainingData: TrainingData[] }
  | { success: false; error: string };

export type GetTrainingAttendanceListResponse =
  | { success: true; attendanceList: PlayerAttendance[] }
  | { success: false; error: string };

export interface PlayerMatchStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
}

export type GetPlayerMatchStatsResponse =
  | { success: true; playerStats: PlayerMatchStat[] }
  | { success: false; error: string };

export type GetMatchDataResponse =
  | { success: true; matchData: MatchData[] }
  | { success: false; error: string };

export interface Sender {
  id: number;
  username: string;
}

export interface Message {
  id: number;
  content: string;
  sender: Sender;
  createdAt: Date;
}

export interface PusherEventMessage {
  id: number;
  content: string;
  sender: Sender;
  createdAt: string;
}

export interface SignedInUser {
  id: string;
  username: string;
  role?: string;
}

export interface ActionResponse {
  success: boolean;
  errors?: ZodIssue[];
}

export interface PlayerResponse {
  id: string;
  username?: string;
  whatsappNumber?: string;
}

export interface PlayerResponseData {
  success: boolean;
  players?: PlayerResponse[];
  errors?: any[];
}

export interface PlayerFormData {
  username: string;
  password: string;
  whatsappNumber: string;
}

export interface MatchFormValues {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: {
    id: number;
    minutes: number | '';
    available: boolean;
  }[];
}

export type PlayersFieldProps = {
  players: Player[];
  playerValues: FormValues['players'];
  setValue: UseFormSetValue<FormValues>;
};

export interface MatchPlayerInfo {
  minutes: number;
  available: boolean;
}

export interface MatchPlayer {
  id: number;
  username: string;
  MatchPlayer: MatchPlayerInfo[];
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

export interface MatchDataHelper {
  id: number;
  date: Date;
  pouleOpponent: {
    team: {
      name: string | null;
    } | null;
  };
  matchPlayers: {
    user: {
      username: string | null;
    };
  }[];
}

export interface PlayerStatsTableProps {
  playerStats: PlayerStat[];
}

export interface PlayerAtTraining {
  userId: number;
  absent: boolean;
}

export interface TrainingPlayersFieldProps {
  players: Player[];
  playerValues: { userId: number; absent: boolean }[];
  setValue: UseFormSetValue<TrainingFormValues>;
}

export interface TrainingPlayer {
  user: {
    username: string | null;
  };
}

export interface TrainingProps {
  id: number;
  date: Date;
  trainingPlayers: TrainingPlayer[];
}

export interface PlayerAttendanceTableProps {
  attendanceList: PlayerAttendance[];
}

export interface TrainingSessionsListProps {
  trainingData: TrainingData[];
}

export interface GetTeamsInPouleSuccess {
  success: true;
  poules: Poule[];
  latestPoule: Poule;
}

export interface GetTeamsInPouleError {
  success: false;
  errors: ZodIssue[];
}

export type GetTeamsInPouleResponse =
  | GetTeamsInPouleSuccess
  | GetTeamsInPouleError;
