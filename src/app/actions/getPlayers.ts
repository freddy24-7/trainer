import { fetchPlayers } from '@/lib/services/getPlayersService';
import { errorFetchingPlayers } from '@/strings/actionStrings';
import { PlayerResponse } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export default async function getPlayers(): Promise<{
  success?: boolean;
  players?: PlayerResponse[];
  errors?: unknown[];
}> {
  try {
    const players = await fetchPlayers();

    return { success: true, players: players as PlayerResponse[] };
  } catch (error) {
    console.error(error);
    return formatError(errorFetchingPlayers);
  }
}
