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
  console.log('addMatchPlayer called with data:', data);

  const validation = handleValidateMatchPlayerData(data);
  console.log('Validation result:', validation);

  if (!validation.success || !validation.data) {
    console.error('Validation failed:', validation.errors);
    return formatError(validationFailedMessage, ['form']);
  }

  const { userId, matchId, minutes, available } =
    validation.data as MatchPlayerData;
  console.log('Adding MatchPlayer to database with:', {
    userId,
    matchId,
    minutes,
    available,
  });

  try {
    await addMatchPlayerToDatabase({ userId, matchId, minutes, available });
    console.log('MatchPlayer added successfully');
    return {
      success: true,
    };
  } catch (error) {
    let errorMessage = failedToAddMatchPlayer;

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Detailed error stack:', error.stack);
    } else {
      console.error('Unknown error occurred:', error);
    }

    return formatError(errorMessage, ['form']);
  }
}
