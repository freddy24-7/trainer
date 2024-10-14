'use server';

import { validateMatchData } from '@/schemas/validation/createMatchValidation';
import { formatError } from '@/utils/errorUtils';
import { ZodIssue } from 'zod';
import {
  findOpponentById,
  createMatch,
} from '@/lib/services/createMatchService';

export default async function addMatch(
  _prevState: any,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validation = validateMatchData(params);

  if (!validation.success) {
    return formatError('Validation failed.', ['form']);
  }

  const { pouleOpponentId, date } = validation.data;

  try {
    const opponentExists = await findOpponentById(pouleOpponentId);

    if (!opponentExists) {
      return formatError('Selected opponent does not exist.', [
        'pouleOpponentId',
      ]);
    }

    const match = await createMatch(pouleOpponentId, date);

    return { match: { id: match.id } };
  } catch (error) {
    return formatError('Failed to create match.', ['form']);
  }
}
