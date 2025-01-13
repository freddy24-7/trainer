import { CalendarDate } from '@nextui-org/react';
import { FieldErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { Poule, PouleOpponent } from '@/types/poule-types';

import { FormValues, Player, PlayerStat } from './user-types';

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

export interface MatchData {
  matchType: 'PRACTICE' | 'COMPETITION';
  date: string | Date;
  pouleOpponentId?: number;
  practiceOpponent?: string;
  id?: number;
  opponentTeamName?: string;
  absentPlayers?: string[];
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

export interface MatchPlayer {
  id: number;
  username: string;
  matchPlayers: MatchPlayerInfo[];
}

export interface MatchPlayerInfo {
  id: number;
  matchId: number;
  userId: number;
  minutes: number;
  available: boolean;
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
  methods: UseFormReturn<FormValues>;
  poules: Poule[];
  players: Player[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  playerValues: FormValues['players'];
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  setValue: UseFormSetValue<FormValues>;
  matchType: 'PRACTICE' | 'COMPETITION';
}

export interface ObtainMatchData {
  id: number;
  date: Date;
  pouleOpponent: {
    id: number;
    team: {
      id: number;
      name: string;
    } | null;
  } | null;
  matchPlayers: {
    id: number;
    available: boolean;
    user: {
      id: number;
      username: string | null;
    };
  }[];
}

export interface UserWithOptionalMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  MatchPlayer?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
  }[];
}

export interface SubmitMatchFormOptions {
  validatePlayers: () => boolean;
  setSubmitting: (submitting: boolean) => void;
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

export type MatchEvent = GoalEvent | AssistEvent | SubstitutionEvent;

export interface BaseEvent {
  minute: number; // Common to all events
}

export interface GoalEvent extends BaseEvent {
  type: 'GOAL';
  scorerId: number; // Required for goals
  assisterId?: number; // Optional for assists
}

export interface AssistEvent extends BaseEvent {
  type: 'ASSIST';
  scorerId: number; // Required to link assist to a goal
  assisterId: number; // Required for assists
}

export interface SubstitutionEvent extends BaseEvent {
  type: 'SUBSTITUTION';
  playerInId: number;
  playerOutId: number;
  reason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER';
}

export interface MatchFormValues {
  poule?: number; // Optional for practice matches
  opponent?: {
    id?: number; // Used for competition matches
    name?: string; // Used for practice matches
  };
  date: CalendarDate | null; // Match date
  players: {
    userId: number;
    minutes: number;
    available: boolean;
    status: 'playing' | 'bench' | 'absent';
  }[];
  matchEvents: MatchEvent[];
  matchType: 'PRACTICE' | 'COMPETITION';
}
