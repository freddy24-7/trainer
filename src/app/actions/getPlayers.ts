import { revalidatePath } from 'next/cache';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { PlayerResponse } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export default async function getPlayers(): Promise<{
  success?: boolean;
  players?: PlayerResponse[];
  errors?: unknown[];
}> {
  try {
    const players = await fetchPlayers();

    revalidatePath('/player-management');

    return { success: true, players: players as PlayerResponse[] };
  } catch (error) {
    console.error(error);
    return formatError('Error fetching players.');
  }
}
