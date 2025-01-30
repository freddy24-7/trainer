import { CalendarDate } from '@heroui/react';
import { FieldErrors, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { Poule, PouleOpponent } from '@/types/poule-types';

import { Player, PlayerMatchStat, PlayerStat } from './user-types';

export type OpponentStrength = 'STRONGER' | 'SIMILAR' | 'WEAKER';

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
    minutes: number;
    available: boolean;
  }[];
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
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  matchEvents?: {
    playerInId?: number | null;
    playerOutId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION' | 'GOAL' | 'ASSIST';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
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
  matchPlayers?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
    match: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  }[];
  MatchEvent?: {
    id: number;
    matchId: number;
    eventType: 'GOAL' | 'ASSIST' | 'SUBSTITUTION';
    minute: number;
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
    playerOutId?: number | null;
    match?: {
      id: number;
      date: Date;
      opponentStrength: OpponentStrength | null;
    };
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

export interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

export interface MatchStat {
  id: number;
  date: Date;
  opponentStrength: OpponentStrength | null;
  minutes: number;
  available: boolean;
}

export interface PlayerOpponentStatData {
  id: number;
  username: string | null;
  matchData: MatchStat[];
}

export interface GoalsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date;
    opponentStrength: OpponentStrength | null;
    minutes: number;
    available: boolean;
    goals: number;
  }[];
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

export interface AssistsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date;
    opponentStrength: OpponentStrength | null;
    minutes: number;
    available: boolean;
    assists: number;
  }[];
}

export interface SubstitutionOutStatData {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date;
    opponentStrength: OpponentStrength | null;
  }[];
}

export interface SubstitutionMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
    match: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  }[];
  substitutedOut?: {
    id: number;
    matchId: number;
    eventType: 'GOAL' | 'ASSIST' | 'SUBSTITUTION';
    minute: number;
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
    playerOutId?: number | null;
    match?: {
      id: number;
      date: Date;
      opponentStrength: OpponentStrength | null;
    };
  }[];
}

export interface SubstitutionInMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
    match: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  }[];
  substitutedIn?: {
    id: number;
    matchId: number;
    eventType: 'GOAL' | 'ASSIST' | 'SUBSTITUTION';
    minute: number;
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
    playerInId?: number | null;
    match?: {
      id: number;
      date: Date;
      opponentStrength: OpponentStrength | null;
    };
  }[];
}
