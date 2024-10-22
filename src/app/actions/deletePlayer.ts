'use server';

import {
  handleFindPlayerById,
  deletePlayerFromDatabase,
  deleteClerkUser,
} from '@/lib/services/deletePlayerService';
import { formatStringError } from '@/utils/errorUtils';

export default async function deletePlayer(
  playerId: number
): Promise<{ success: boolean; errors?: string }> {
  try {
    const player = await handleFindPlayerById(playerId);
    if (!player || !player.clerkId) {
      return formatStringError('Player not found or Clerk ID is missing.');
    }

    await deleteClerkUser(player.clerkId);
    await deletePlayerFromDatabase(playerId);

    return { success: true, errors: undefined };
  } catch (error) {
    console.error(error);
    return formatStringError('Error deleting the player.');
  }
}
