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
  pouleOpponentId: number | null,
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null
): Promise<{ errors?: ZodIssue[] } | null> {
  console.log('Validating competition match:', {
    trainingMatch,
    pouleOpponentId,
    opponentStrength,
  });

  if (trainingMatch) return null;

  if (pouleOpponentId === null) {
    console.log('Validation failed: pouleOpponentId is null');
    return formatError(validationFailedMessage, ['pouleOpponentId']);
  }

  const opponentExists = await handleFindOpponentById(pouleOpponentId);
  console.log('PouleOpponent validation result:', opponentExists);

  if (!opponentExists) {
    console.log('Validation failed: PouleOpponent does not exist');
    return formatError(opponentNotExistMessage, ['pouleOpponentId']);
  }

  if (
    opponentStrength &&
    !['STRONGER', 'SIMILAR', 'WEAKER'].includes(opponentStrength)
  ) {
    console.log('Validation failed: Invalid opponentStrength value');
    return formatError(validationFailedMessage, ['opponentStrength']);
  }

  console.log('Competition match validation passed.');
  return null;
}

async function handleProcessMatchCreation(data: {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string;
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  matchEvents?: {
    playerInId?: number | null;
    playerOutId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
}): Promise<{ match: { id: number } } | { errors: ZodIssue[] }> {
  console.log('Processing match creation with data:', data);

  try {
    const match = await createMatch(data);
    console.log('Match created with ID:', match.id);

    return { match: { id: match.id } };
  } catch (error) {
    console.error('Error during match creation:', error);
    return formatError(failedToCreateMatchMessage, ['form']);
  }
}

export default async function addMatch(
  _prevState: unknown,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  console.log('Starting match creation with params:', params);

  const validation = handleValidateMatchData(params);
  if (!validation.success || !validation.data) {
    console.log('Validation failed:', validation);
    return formatError(validationFailedMessage, ['form']);
  }

  console.log('Validation passed. Match data:', validation.data);

  const {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date,
    opponentStrength,
    matchEvents = [],
  } = validation.data;

  const competitionValidationError =
    await handleValidateAndHandleCompetitionMatch(
      trainingMatch,
      pouleOpponentId
    );
  if (competitionValidationError) {
    console.log(
      'Competition match validation failed:',
      competitionValidationError
    );
    return competitionValidationError;
  }

  const matchResponse = await handleProcessMatchCreation({
    trainingMatch,
    pouleOpponentId: trainingMatch ? null : pouleOpponentId,
    opponentName: trainingMatch ? opponentName : null,
    date: date ?? '',
    opponentStrength: opponentStrength ?? null,
    matchEvents: matchEvents ?? [],
  });

  console.log('Match creation response:', matchResponse);
  return matchResponse;
}
