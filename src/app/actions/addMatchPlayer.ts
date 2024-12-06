'use server';

import { ZodIssue } from 'zod';

import { addMatchPlayerToDatabase } from '@/lib/services/createMatchPlayerService';
import { handleValidateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import {
  validationFailedMessage,
  failedToAddMatchPlayer,
} from '@/strings/actionStrings';
import { MatchPlayerData } from '@/types/validation-types';
import { formatError } from '@/utils/errorUtils';

export default async function addMatchPlayer(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}): Promise<{ success?: boolean; errors?: ZodIssue[] }> {
  const validation = handleValidateMatchPlayerData(data);

  if (!validation.success || !validation.data) {
    return formatError(validationFailedMessage, ['form']);
  }

  const { userId, matchId, minutes, available } =
    validation.data as MatchPlayerData;

  try {
    await addMatchPlayerToDatabase({ userId, matchId, minutes, available });

    return {
      success: true,
    };
  } catch (error) {
    console.error(failedToAddMatchPlayer, error);

    return formatError(failedToAddMatchPlayer, ['form']);
  }
}
