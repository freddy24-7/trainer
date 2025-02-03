'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { errorFetchingPlayerStats } from '@/strings/actionStrings';
import {
  GetPlayerStatsReturn,
  UserWithOptionalMatchStats,
} from '@/types/stats-types';
import { formatError } from '@/utils/errorUtils';

export async function getPlayerStats(): Promise<GetPlayerStatsReturn> {
  try {
    const players: UserWithOptionalMatchStats[] = await fetchPlayers();

    return players.map((player) => ({
      id: player.id,
      username: player.username,
      matchData:
        player.matchPlayers?.map((mp) => ({
          id: mp.matchId,
          date: mp.match?.date,
          minutes: mp.minutes,
          available: mp.available,
          goals:
            player.MatchEvent?.filter(
              (event) =>
                event.matchId === mp.matchId && event.eventType === 'GOAL'
            ).length || 0,
          assists:
            player.MatchEvent?.filter(
              (event) =>
                event.matchId === mp.matchId && event.eventType === 'ASSIST'
            ).length || 0,
        })) || [],
    }));
  } catch (error) {
    console.error(errorFetchingPlayerStats, error);
    const formattedError = formatError(errorFetchingPlayerStats, [
      'getPlayerStats',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
