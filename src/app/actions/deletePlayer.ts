'use server';

import {
  findPlayerById,
  deletePlayerFromDatabase,
  deleteClerkUser,
} from '@/lib/services/deletePlayerService';
import { formatError } from '@/utils/errorUtils';

export default async function deletePlayer(
  playerId: number
): Promise<{ errors: any[]; success?: boolean }> {
  try {
    const player = await findPlayerById(playerId);
    if (!player || !player.clerkId) {
      return formatError('Player not found or Clerk ID is missing.');
    }

    await deleteClerkUser(player.clerkId);
    await deletePlayerFromDatabase(playerId);

    return { errors: [], success: true };
  } catch (error) {
    return formatError('Error deleting the player.');
  }
}
