import { OpponentStrength } from '@prisma/client';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { UserWithOptionalMatchStats } from '@/types/match-types';

interface OpponentStats {
  strongerMatches: number;
  strongerMinutes: number;
  similarMatches: number;
  similarMinutes: number;
  weakerMatches: number;
  weakerMinutes: number;
}

interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

export async function getPlayerOpponentStats(): Promise<PlayerOpponentStat[]> {
  const players = await fetchPlayers();

  return players.map((player: UserWithOptionalMatchStats) => {
    const stats: OpponentStats = {
      strongerMatches: 0,
      strongerMinutes: 0,
      similarMatches: 0,
      similarMinutes: 0,
      weakerMatches: 0,
      weakerMinutes: 0,
    };

    player.matchPlayers?.forEach((mp) => {
      if (!mp.available || !mp.match?.opponentStrength) return;

      switch (mp.match.opponentStrength) {
        case OpponentStrength.STRONGER:
          stats.strongerMatches += 1;
          stats.strongerMinutes += mp.minutes;
          break;
        case OpponentStrength.SIMILAR:
          stats.similarMatches += 1;
          stats.similarMinutes += mp.minutes;
          break;
        case OpponentStrength.WEAKER:
          stats.weakerMatches += 1;
          stats.weakerMinutes += mp.minutes;
          break;
      }
    });

    const avgMinutesStronger =
      stats.strongerMatches > 0
        ? stats.strongerMinutes / stats.strongerMatches
        : 0;
    const avgMinutesSimilar =
      stats.similarMatches > 0
        ? stats.similarMinutes / stats.similarMatches
        : 0;
    const avgMinutesWeaker =
      stats.weakerMatches > 0 ? stats.weakerMinutes / stats.weakerMatches : 0;

    return {
      id: player.id,
      username: player.username,
      avgMinutesStronger,
      avgMinutesSimilar,
      avgMinutesWeaker,
    };
  });
}
