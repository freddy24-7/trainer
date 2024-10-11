'use server';

import { validateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
import {
  findPlayerById,
  updatePlayerInDatabase,
  updateClerkUser,
} from '@/lib/services/editPlayerService';
import { formatError } from '@/utils/errorUtils';

export default async function editPlayer(
  playerId: number,
  params: FormData
): Promise<{ errors: any[]; success?: boolean }> {
  const validation = validateEditPlayerData(params);
  if (!validation.success) {
    return { errors: validation.errors || [] };
  }

  const { username, password, whatsappNumber } = validation.data;

  try {
    const player = await findPlayerById(playerId);
    if (!player || !player.clerkId || player.username === null) {
      return formatError(
        'Player not found, Clerk ID missing, or username is null.'
      );
    }

    await updateClerkUser(player.clerkId, { username, password });

    await updatePlayerInDatabase(playerId, { username, whatsappNumber });

    return { errors: [], success: true };
  } catch (error) {
    return formatError('Error updating the player.');
  }
}
