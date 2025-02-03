import { MatchDataEntry } from '@/types/user-types';

export interface PlayerMatchStat {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date | undefined;
    minutes: number;
    available: boolean;
    goals: number;
    assists: number;
  }[];
}

export interface PlayerStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
  goals: number;
  assists: number;
  matchData?: MatchDataEntry[];
}

export interface PlayerStatsTableProps {
  playerStats: PlayerStat[];
}
