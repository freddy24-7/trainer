'use server';

import { validateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import { formatError } from '@/utils/errorUtils';
import { ZodIssue } from 'zod';
import { addMatchPlayerToDatabase } from '@/lib/services/createMatchPlayerService';

export default async function addMatchPlayer(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}): Promise<{ success?: boolean; errors?: ZodIssue[] }> {
  const validation = validateMatchPlayerData(data);

  if (!validation.success) {
    return formatError('Validation failed.', ['form']);
  }

  const { userId, matchId, minutes, available } = validation.data;

  try {
    await addMatchPlayerToDatabase({ userId, matchId, minutes, available });

    return {
      success: true,
    };
  } catch (error) {
    return formatError('Failed to add match player to the database.', ['form']);
  }
}
