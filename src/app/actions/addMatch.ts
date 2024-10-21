'use server';

import { ZodIssue } from 'zod';

import {
  handleFindOpponentById,
  createMatch,
} from '@/lib/services/createMatchService';
import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import { formatError } from '@/utils/errorUtils';

export default async function addMatch(
  _prevState: unknown,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validation = handleValidateMatchData(params);

  if (!validation.success || !validation.data) {
    return formatError('Validation failed.', ['form']);
  }

  const { pouleOpponentId, date } = validation.data;

  try {
    const opponentExists = await handleFindOpponentById(pouleOpponentId);

    if (!opponentExists) {
      return formatError('Selected opponent does not exist.', [
        'pouleOpponentId',
      ]);
    }

    const match = await createMatch(pouleOpponentId, date ?? '');

    return { match: { id: match.id } };
  } catch {
    return formatError('Failed to create match.', ['form']);
  }
}
