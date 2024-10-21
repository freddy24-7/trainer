'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { GetPlayerMatchStatsResponse } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';
import { mapPlayerStats, getValidPlayers } from '@/utils/matchPlayerUtils';

export async function getPlayerStats(): Promise<GetPlayerMatchStatsResponse> {
  try {
    const players = await fetchPlayers(true);

    const validPlayers = getValidPlayers(players);

    const playerStats = mapPlayerStats(validPlayers);

    return { success: true, playerStats };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    const formattedError = formatError('Failed to fetch player stats.', [
      'getPlayerStats',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
