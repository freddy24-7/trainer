'use server';

import { ZodIssue } from 'zod';

import {
  handleFindPlayerById,
  updatePlayerInDatabase,
  updateClerkUser,
} from '@/lib/services/editPlayerService';
import { handleValidateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
import {
  playerNotFoundOrInvalid,
  errorUpdatingPlayer,
} from '@/strings/actionStrings';
import { EditPlayerFormData } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export default async function handleEditPlayer(
  playerId: number,
  params: FormData
): Promise<{ errors: ZodIssue[]; success?: boolean }> {
  const validation = handleValidateEditPlayerData(params);
  if (!validation.success) {
    return { errors: validation.errors || [], success: false };
  }

  const { username, password, whatsappNumber } =
    validation.data as EditPlayerFormData;

  try {
    const player = await handleFindPlayerById(playerId);
    if (!player || !player.clerkId || player.username === null) {
      return formatError(playerNotFoundOrInvalid);
    }

    await updateClerkUser(player.clerkId, { username, password });
    await updatePlayerInDatabase(playerId, { username, whatsappNumber });

    return { errors: [], success: true };
  } catch (error) {
    console.error(error);
    return formatError(errorUpdatingPlayer);
  }
}
