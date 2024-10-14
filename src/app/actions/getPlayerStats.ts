'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { GetPlayerMatchStatsResponse } from '@/types/type-list';
import { formatError } from '@/utils/errorUtils';
import { mapPlayerStats, getValidPlayers } from '@/utils/matchPlayerUtils';

export async function getPlayerStats(): Promise<GetPlayerMatchStatsResponse> {
  try {
    const players = await fetchPlayers(true);

    const validPlayers = getValidPlayers(players);

    const playerStats = mapPlayerStats(validPlayers);

    return { success: true, playerStats };
  } catch (error) {
    const formattedError = formatError('Failed to fetch player stats.', [
      'getPlayerStats',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
