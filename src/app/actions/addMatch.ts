'use server';

import { ZodIssue } from 'zod';

import {
  handleFindOpponentById,
  createMatch,
} from '@/lib/services/createMatchService';
import { handleValidateMatchData } from '@/schemas/validation/createMatchValidation';
import {
  validationFailedMessage,
  opponentNotExistMessage,
  failedToCreateMatchMessage,
} from '@/strings/actionStrings';
import { formatError } from '@/utils/errorUtils';

async function handleValidateAndHandleCompetitionMatch(
  trainingMatch: boolean,
  pouleOpponentId: number | null
): Promise<{ errors?: ZodIssue[] } | null> {
  if (trainingMatch) return null;

  if (pouleOpponentId === null) {
    return formatError(validationFailedMessage, ['pouleOpponentId']);
  }

  const opponentExists = await handleFindOpponentById(pouleOpponentId);
  if (!opponentExists) {
    return formatError(opponentNotExistMessage, ['pouleOpponentId']);
  }

  return null;
}

async function handleProcessMatchCreation(data: {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string;
}): Promise<{ match: { id: number } } | { errors: ZodIssue[] }> {
  try {
    const match = await createMatch(data);
    return { match: { id: match.id } };
  } catch {
    return formatError(failedToCreateMatchMessage, ['form']);
  }
}

export default async function addMatch(
  _prevState: unknown,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validation = handleValidateMatchData(params);
  if (!validation.success || !validation.data) {
    return formatError(validationFailedMessage, ['form']);
  }

  const { trainingMatch, pouleOpponentId, opponentName, date } =
    validation.data;

  const competitionValidationError =
    await handleValidateAndHandleCompetitionMatch(
      trainingMatch,
      pouleOpponentId
    );
  if (competitionValidationError) {
    return competitionValidationError;
  }

  return handleProcessMatchCreation({
    trainingMatch,
    pouleOpponentId: trainingMatch ? null : pouleOpponentId,
    opponentName: trainingMatch ? opponentName : null,
    date: date ?? '',
  });
}
