import { CalendarDate } from '@heroui/react';
import React from 'react';
import { FieldErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { Poule, PouleOpponent } from '@/types/poule-types';

import { Player, PlayerMatchStat, PlayerStat } from './user-types';

export type OpponentStrength = 'STRONGER' | 'SIMILAR' | 'WEAKER';
export type MatchType = 'competition' | 'practice';
export type EventType = 'SUBSTITUTION' | 'GOAL' | 'ASSIST';
export type SubstitutionReason = 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER';

export interface BaseMatch {
  id: number;
  date: Date;
  opponentStrength: OpponentStrength | null;
}

export interface BaseMatchEvent {
  id?: number;
  matchId?: number;
  eventType: EventType;
  minute: number;
  substitutionReason?: SubstitutionReason | null;
  playerInId?: number | null;
  playerOutId?: number | null;
  playerId?: number | null;
  match?: {
    id: number;
    date: Date;
    opponentStrength: OpponentStrength | null;
  };
}

export interface BaseMatchPlayer {
  id: number;
  matchId: number;
  userId: number;
  minutes: number;
  available: boolean;
}

export interface BaseMatchStat extends BaseMatch {
  opponentStrength: OpponentStrength | null;
  minutes: number;
  available: boolean;
}

export interface MatchFormProps {
  poules: Poule[];
  players: Player[];
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

export interface MatchClientProps {
  playerStats: PlayerStat[];
}

export interface MatchData extends BaseMatch {
  opponentTeamName: string;
  absentPlayers: string[];
}

export interface MatchDataHelper extends BaseMatch {
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

export interface MatchFormValues {
  matchType: MatchType;
  poule: number | undefined;
  opponent: number | undefined;
  opponentName: string;
  date: CalendarDate | null;
  players: {
    id: number;
    minutes: number;
    available: boolean;
  }[];
  opponentStrength?: OpponentStrength | null;
  matchEvents?: BaseMatchEvent[];
}

export interface PlayerInMatch {
  id: number;
  minutes: string;
  available: boolean;
}

export interface MatchDetailProps {
  match: MatchData;
}

export interface MatchFormFieldProps {
  methods: UseFormReturn<MatchFormValues>;
  poules: Poule[];
  players: Player[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  playerValues: MatchFormValues['players'];
  errors: FieldErrors<MatchFormValues>;
  onSubmit: (data: MatchFormValues) => Promise<void>;
  setValue: UseFormSetValue<MatchFormValues>;
  playerId?: number | null;
  opponentStrength?: OpponentStrength | null;
  matchEvents?: BaseMatchEvent[];
}

export interface ObtainMatchData extends BaseMatch {
  pouleOpponent: {
    id: number;
    team: {
      id: number;
      name: string;
    } | null;
  } | null;
  matchPlayers: (BaseMatchPlayer & {
    user: {
      id: number;
      username: string | null;
    };
  })[];
}

export interface UserWithOptionalMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  MatchEvent?: BaseMatchEvent[];
}

export interface SubmitMatchFormOptions {
  validatePlayers: () => boolean;
  setSubmitting: (submitting: boolean) => void;
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

export interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutes?: number;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

export interface PlayerOpponentStatData {
  id: number;
  username: string | null;
  matchData: BaseMatchStat[];
}

export interface GoalsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: (BaseMatchStat & { goals: number })[];
}

export interface AssistsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: (BaseMatchStat & { assists: number })[];
}

export interface SubstitutionOutStatData {
  id: number;
  username: string | null;
  matchData: BaseMatch[];
}

export interface MatchStatsWrapperProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStatData[];
  initialGoalStats: GoalsByPlayerStatData[];
  initialAssistStats: AssistsByPlayerStatData[];
  initialSubstitutionStats: SubstitutionOutStatData[];
  initialSubstitutionInjuryStats: SubstitutionOutStatData[];
  initialSubstitutionOutTacticalStats: SubstitutionOutStatData[];
  initialSubstitutionInTacticalStats: SubstitutionOutStatData[];
}

export interface SubstitutionMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  substitutedOut?: BaseMatchEvent[];
}

export interface SubstitutionInMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  substitutedIn?: BaseMatchEvent[];
}

export interface MatchPlayerInfo extends BaseMatchPlayer {}

export interface MatchPlayer {
  id: number;
  username: string;
  matchPlayers: MatchPlayerInfo[];
}

export interface MatchEvent extends BaseMatchEvent {
  playerId?: number | null;
}

export interface PlayerMatchData {
  id: number;
  date: Date | undefined;
  minutes: number;
  available: boolean;
  goals: number;
  assists: number;
}

export interface PlayerDataAdd {
  id: number;
  username: string | null;
  matchData: PlayerMatchData[];
}

export type GetPlayerStatsReturn =
  | PlayerDataAdd[]
  | { success: false; error: string };

export interface TrainingPlayerDisplay {
  id: number;
  username: string | null;
  absent: boolean;
}

export interface TrainingDataDisplay {
  id: number;
  date: Date;
  players: TrainingPlayerDisplay[];
}

export interface AskAddAssistModalProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
}

export interface ConfirmAssistModalProps {
  isOpen: boolean;
  assistProvider: Player | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export interface ConfirmGoalModalProps {
  isOpen: boolean;
  goalScorer: Player | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export type ModalStep =
  | 'SELECT_GOAL_SCORER'
  | 'CONFIRM_GOAL'
  | 'ASK_ADD_ASSIST'
  | 'SELECT_ASSIST'
  | 'CONFIRM_ASSIST'
  | 'CLOSED';

export interface GoalAssistModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  onConfirm: (playerId: number, eventType: 'GOAL' | 'ASSIST') => void;
}

export interface MatchDurationInputProps {
  matchDuration: number;
  onDurationChange: (newDuration: number) => void;
}

export interface MatchFormSetFieldProps
  extends Pick<
    MatchFormFieldProps,
    | 'poules'
    | 'players'
    | 'errors'
    | 'setValue'
    | 'opponentStrength'
    | 'matchEvents'
    | 'playerValues'
    | 'selectedPoule'
    | 'selectedOpponent'
  > {
  matchType: 'competition' | 'practice';
  setLineupFinalized: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlayerManagementProps {
  players: Player[];
  playerValues: MatchFormValues['players'];
  setValue: UseFormSetValue<MatchFormValues>;
  matchEvents: MatchFormValues['matchEvents'];
}

export interface MatchTypeSelectionProps {
  matchType: 'competition' | 'practice';
  setValue: UseFormSetValue<MatchFormValues>;
}

export interface FieldError {
  message?: string;
}

export interface OpponentFieldProps {
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: { opponent?: FieldError };
  onChange: (opponentId: number) => void;
}

export interface OpponentLogicProps {
  matchType: 'competition' | 'practice';
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  poules: Poule[];
  errors: FieldErrors<MatchFormValues>;
  setValue: UseFormSetValue<MatchFormValues>;
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
}

export interface SelectAssistModalProps {
  isOpen: boolean;
  playersOnPitch: Player[];
  onSelect: (player: Player) => void;
  onCancel: () => void;
}

export interface SelectGoalScorerModalProps {
  isOpen: boolean;
  playersOnPitch: Player[];
  onSelect: (player: Player) => void;
  onCancel: () => void;
}

export interface StrengthModalProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  isConfirmOpen: boolean;
  onConfirmOpen: () => void;
  onConfirmChange: (value: boolean) => void;

  selectedStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  setSelectedStrength: React.Dispatch<
    React.SetStateAction<'STRONGER' | 'SIMILAR' | 'WEAKER' | null>
  >;

  handleConfirmStrength: () => void;
}

export interface SubstitutionDetailsProps {
  player: Player;
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  substitutions: Substitution[];
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
}

export interface SubstitutionManagementBodyProps {
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  minute: number | '';
  setMinute: React.Dispatch<React.SetStateAction<number | ''>>;
  substitutions: Substitution[];
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
}

export interface SubstitutionManagementProps {
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  matchEvents: MatchFormValues['matchEvents'];
  onSubstitution: (
    minute: number,
    playerInId: number,
    playerOutId: number,
    substitutionReason: SubstitutionReason
  ) => void;
  setValue: UseFormSetValue<MatchFormValues>;
  setPlayerStates: React.Dispatch<
    React.SetStateAction<Record<number, 'playing' | 'bench' | 'absent'>>
  >;
}

export interface SubstitutionReasonSelectorProps {
  value: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  onChange: (reason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER') => void;
}

export interface SubstitutionData {
  minute: number;
  playerInId: number;
  playerOutId: number;
  substitutionReason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
}

export interface GameState {
  matchEvents: MatchFormValues['matchEvents'];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
}

export interface Substitution {
  playerOutId: number;
  playerInId: number | null;
  substitutionReason: SubstitutionReason | null;
}
