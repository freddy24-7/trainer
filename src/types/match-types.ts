import { CalendarDate } from '@nextui-org/react';

import { PlayerStat } from './user-types';

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
  poule: number | undefined;
  opponent: number | undefined;
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
  MatchPlayer: MatchPlayerInfo[];
}

export interface MatchPlayerInfo {
  minutes: number;
  available: boolean;
}

export interface PlayerInMatch {
  id: number;
  minutes: string;
  available: boolean;
}
