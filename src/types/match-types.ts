import { CalendarDate } from '@heroui/react';
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
}

export interface BaseMatchEvent {
  id?: number;
  matchId?: number;
  eventType: EventType;
  minute: number;
  substitutionReason?: SubstitutionReason | null;
  playerInId?: number | null;
  playerOutId?: number | null;
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
  avgMinutes: number;
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

export interface TrainingDataPlayer {
  id: number;
  username: string;
  absent: boolean;
}

export interface TrainingDataResponse {
  id: number;
  date: Date;
  players: TrainingDataPlayer[];
}
