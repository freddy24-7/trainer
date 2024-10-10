'use server';

import { deleteUserInClerk } from '@/lib/services/clerkDeletePlayerService';
import { deleteUserInPrisma } from '@/lib/services/prismaDeletePlayerService';
import { fetchPlayer } from '@/lib/services/prismaPlayerService';
import { handleError } from '@/utils/responseUtils';

export async function deletePlayer(
  playerId: number
): Promise<{ errors?: string[]; success?: boolean }> {
  try {
    const player = await fetchPlayer(playerId);

    if (!player || !player.clerkId) {
      return handleError('Player not found or Clerk ID is missing.');
    }

    await deleteUserInClerk(player.clerkId);

    await deleteUserInPrisma(playerId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting the player:', error);
    return handleError('Error deleting the player.');
  }
}
