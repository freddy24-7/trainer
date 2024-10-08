import { CalendarDate } from '@nextui-org/react';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormReturn,
  UseFormSetValue,
} from 'react-hook-form';
import { ZodIssue } from 'zod';

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
  username: string | null;
  whatsappNumber: string | null;
}

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

export interface PlayerManagementActions {
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setSubmitting: (submitting: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setModalBody: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setModalTitle: React.Dispatch<React.SetStateAction<string>>;
  setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
  setEditPlayerData: React.Dispatch<React.SetStateAction<Player | null>>;
}

// export interface PlayerInputProps {
//   player: Player;
//   minutes: number;
//   available: boolean;
//   onMinutesChange: (playerId: number, minutes: string) => void;
//   onAvailabilityChange: (playerId: number, available: boolean) => void;
// }
export interface PlayerInputProps {
  player: Player;
  minutes: number | string;
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
  editPlayerResponse?: EditPlayerResponse;
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
  sender: {
    id: number;
    username: string | null;
  };
  createdAt: Date;
}

export interface PusherEventMessage {
  id: number;
  content: string;
  sender: Sender;
  createdAt: string;
}

export interface ActionResponse {
  success: boolean;
  errors?: ZodIssue[];
}

export interface MobileMenuProps {
  userId: string | null;
  userRole: string | null;
  menuOpen: boolean;
  dropdownTextColor: string;
}

export interface MobileMenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export interface EditPlayerResponse {
  success?: boolean;
  errors: ZodIssue[];
}

export interface SendMessageParams {
  action: (prevState: unknown, params: FormData) => Promise<ActionResponse>;
  signedInUser: SignedInUser;
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
}

export interface HandleFormSubmitOptions {
  data: PouleFormValues;
  action: (params: FormData) => Promise<{ errors: ZodIssue[] } | void>;
  reset: () => void;
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlayerManagementState {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: string;
  setModalTitle: React.Dispatch<React.SetStateAction<string>>;
  modalBody: ReactNode;
  setModalBody: React.Dispatch<React.SetStateAction<ReactNode>>;
  confirmAction: () => void;
  setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
  editPlayerData: Player | null;
  setEditPlayerData: React.Dispatch<React.SetStateAction<Player | null>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

export interface PlayerManagementReturn {
  submitting: boolean;
  isModalOpen: boolean;
  modalTitle: string;
  modalBody: React.ReactNode;
  confirmAction: (() => void) | undefined;
  editPlayerData: Player | null;
  players: Player[];
  handleDeletePlayer: (playerId: number) => void;
  handleEditPlayer: (player: Player) => void;
  handlePlayerEdited: (updatedPlayer: Player) => void;
  handleCloseModal: () => void;
  setSubmitting: (submitting: boolean) => void;
  editPlayer: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[]; success?: boolean }>;
}

export interface UsePlayerFormReturn {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  whatsappNumber: string;
  setWhatsappNumber: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  success: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface PlayerData {
  username: string;
  password: string;
  whatsappNumber: string;
}

export interface UpdatedPlayer {
  id: number;
  username: string;
  whatsappNumber: string;
  whatsappLink: string;
}

export type ActionFunction = (
  playerId: number,
  params: FormData
) => Promise<{ errors: ZodIssue[]; success?: boolean }>;

export interface UseEditPlayerProps {
  playerId: number;
  action: ActionFunction;
  onPlayerEdited: (updatedPlayer: UpdatedPlayer) => void;
}

export interface UseEditPlayerReturn {
  isSubmitting: boolean;
  playerData: PlayerData | null;
  handleEditPlayer: (data: PlayerData) => Promise<void>;
}

export interface UseChatMessagesReturn {
  messages: Message[];
  loading: boolean;
}

export interface ActionError {
  message: string;
  path?: string[];
}

export interface TrainingActionResponse {
  success?: boolean;
  errors?: ActionError[];
}

export interface UseAddTrainingFormProps {
  action: (params: FormData) => Promise<TrainingActionResponse>;
}

export interface UseAddTrainingFormReturn {
  onSubmit: SubmitHandler<TrainingFormValues>;
}

export interface UseAddPouleFormProps {
  action: (params: FormData) => Promise<{ errors: ZodIssue[] } | void>;
}

export interface UseAddPouleFormReturn {
  opponents: string[];
  showForm: boolean;
  toggleForm: () => void;
  methods: UseFormReturn<PouleFormValues>;
  addOpponent: () => void;
  removeOpponent: (index: number) => void;
  onSubmit: (data: PouleFormValues) => Promise<void>;
}

export interface HandleAddOpponentProps {
  opponentName: string;
  opponents: string[];
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormReturn<PouleFormValues>['setValue'];
}

export type PlayerActionFunction = (
  _prevState: unknown,
  params: FormData
) => Promise<{ errors: ZodIssue[] }>;

export interface UseAddPlayerReturn {
  isSubmitting: boolean;
  playerData: PlayerData | null;
  formKey: number;
  handleAddPlayer: (data: PlayerData) => Promise<void>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DateFieldProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

export interface TrainingActionError {
  message: string;
  path?: string[];
}

export interface AbsentPlayersListProps {
  players: Player[];
}

export interface ToggleFormButtonProps {
  showForm: boolean;
  toggleForm: () => void;
}

export interface PouleNameInputProps {
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
}

export interface PouleFormProps {
  methods: UseFormReturn<PouleFormValues>;
  opponents: string[];
  addOpponent: () => void;
  removeOpponent: (index: number) => void;
  onSubmit: SubmitHandler<PouleFormValues>;
}

export interface OpponentsListProps {
  opponents: string[];
  removeOpponent: (index: number) => void;
}

export interface MainTeamNameInputProps {
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
}

export interface WhatsappNumberInputProps {
  whatsappNumber: string;
  setWhatsappNumber: React.Dispatch<React.SetStateAction<string>>;
}

export interface WhatsappMessageLinkProps {
  whatsappNumber: string;
  message: string;
  onClick?: () => void;
  className?: string;
}

export interface UsernameInputProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export interface SuccessMessageProps {
  message: string;
}

export interface PasswordInputProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export interface FormButtonsProps {
  submitButtonText: string;
  onAbort?: () => void;
}

export interface ErrorMessageProps {
  message: string;
}

export interface PouleFieldProps {
  control: Control<FormValues>;
  poules: Poule[];
  selectedPoule: Poule | null;
  errors: FieldErrors<FormValues>;
}

export interface PlayerListWrapperProps {
  players: Player[];
  playerValues: { id: number; minutes: number | ''; available: boolean }[];
  setValue: UseFormSetValue<FormValues>;
}

export interface OpponentFieldProps {
  control: Control<FormValues>;
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  errors: FieldErrors<FormValues>;
}

export interface MatchDetailsFieldsProps {
  poules: Poule[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: FieldErrors<FormValues>;
}

export interface AddMatchFormFieldsProps {
  poules: Poule[];
  players: Player[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export interface MessageListProps {
  messages: Message[];
  signedInUser: SignedInUser;
}

export interface MessageInputProps {
  action: (prevState: unknown, params: FormData) => Promise<ActionResponse>;
  signedInUser: SignedInUser;
}

export interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole: string;
}

export interface SignedInUser {
  id: string;
  username: string;
  role?: string;
}

export interface MatchPlayer {
  id: number;
  minutes: string;
  available: boolean;
}

export interface ValidationResult {
  data?: {
    pouleOpponentId: number;
    date: string;
  };
  errors?: ZodIssue[];
}
