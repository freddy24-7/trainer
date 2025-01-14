import { CalendarDate } from '@nextui-org/react';
import { FieldErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { Poule, PouleOpponent } from '@/types/poule-types';

import { Player, PlayerStat } from './user-types';

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
  id: number;
  date: Date;
  opponentTeamName: string;
  absentPlayers: string[];
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

export interface MatchFormValues {
  matchType: 'competition' | 'practice';
  poule: number | undefined;
  opponent: number | undefined;
  opponentName: string;
  date: CalendarDate | null;
  players: {
    id: number;
    minutes: number | '';
    available: boolean;
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
  methods: UseFormReturn<MatchFormValues>;
  poules: Poule[];
  players: Player[];
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  playerValues: MatchFormValues['players'];
  errors: FieldErrors<MatchFormValues>;
  onSubmit: (data: MatchFormValues) => Promise<void>;
  setValue: UseFormSetValue<MatchFormValues>;
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
