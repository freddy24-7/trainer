import { MatchPlayerInfo } from '@/types/match-types';

export const calculateMatchesPlayed = (
  matchPlayers: MatchPlayerInfo[] = []
): number => matchPlayers.filter((mp) => mp.available).length;

export const calculateTotalMinutesPlayed = (
  matchPlayers: MatchPlayerInfo[] = []
): number =>
  matchPlayers.reduce((acc, mp) => (mp.available ? acc + mp.minutes : acc), 0);

export const calculateAveragePlayingTime = (
  totalMinutesPlayed: number,
  matchesPlayed: number
): number => (matchesPlayed > 0 ? totalMinutesPlayed / matchesPlayed : 0);

export const calculateAbsences = (
  matchPlayers: MatchPlayerInfo[] = []
): number => matchPlayers.filter((mp) => !mp.available).length;

export const mapPlayerStats = (
  players: {
    id: number;
    username: string;
    matchPlayers: {
      id: number;
      matchId: number;
      userId: number;
      minutes: number;
      available: boolean;
    }[];
    MatchEvent?: {
      id: number;
      eventType: 'GOAL' | 'ASSIST' | 'SUBSTITUTION';
      minute: number;
    }[];
  }[]
) => {
  return players.map((player) => {
    const matchesPlayed = calculateMatchesPlayed(player.matchPlayers);
    const totalMinutesPlayed = calculateTotalMinutesPlayed(player.matchPlayers);
    const averagePlayingTime = calculateAveragePlayingTime(
      totalMinutesPlayed,
      matchesPlayed
    );
    const absences = calculateAbsences(player.matchPlayers);

    const goals = player.MatchEvent
      ? player.MatchEvent.filter((evt) => evt.eventType === 'GOAL').length
      : 0;
    const assists = player.MatchEvent
      ? player.MatchEvent.filter((evt) => evt.eventType === 'ASSIST').length
      : 0;

    return {
      id: player.id,
      username: player.username,
      matchesPlayed,
      averagePlayingTime,
      absences,
      goals,
      assists,
    };
  });
};

export const getValidPlayers = (
  players: {
    id: number;
    username: string | null;
    whatsappNumber: string | null;
    matchPlayers?: {
      id: number;
      matchId: number;
      userId: number;
      minutes: number;
      available: boolean;
    }[];
    MatchEvent?: {
      id: number;
      eventType: 'GOAL' | 'ASSIST' | 'SUBSTITUTION';
      minute: number;
    }[];
  }[]
) => {
  return players
    .filter((player) => player.username !== null)
    .map((player) => ({
      id: player.id,
      username: player.username as string,
      matchPlayers: player.matchPlayers ?? [],
      MatchEvent: player.MatchEvent ?? [],
    }));
};
