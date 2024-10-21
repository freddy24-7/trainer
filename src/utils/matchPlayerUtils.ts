import { MatchPlayerInfo, MatchPlayer } from '@/types/match-types';

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
  players: MatchPlayer[]
): {
  id: number;
  username: string;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
}[] => {
  return players.map((player) => {
    const matchesPlayed = calculateMatchesPlayed(player.MatchPlayer);
    const totalMinutesPlayed = calculateTotalMinutesPlayed(player.MatchPlayer);
    const averagePlayingTime = calculateAveragePlayingTime(
      totalMinutesPlayed,
      matchesPlayed
    );
    const absences = calculateAbsences(player.MatchPlayer);

    return {
      id: player.id,
      username: player.username,
      matchesPlayed,
      averagePlayingTime,
      absences,
    };
  });
};

export const getValidPlayers = (
  players: {
    id: number;
    username: string | null;
    whatsappNumber: string | null;
    MatchPlayer: {
      id: number;
      matchId: number;
      userId: number;
      minutes: number;
      available: boolean;
    }[];
  }[]
): MatchPlayer[] => {
  return players
    .filter((player) => player.username !== null)
    .map((player) => ({
      id: player.id,
      username: player.username as string,
      MatchPlayer: player.MatchPlayer,
    }));
};
