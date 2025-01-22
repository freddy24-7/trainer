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

interface MatchEvent {
  playerInId?: number | null;
  playerOutId?: number | null;
  playerId?: number | null;
  minute: number;
  eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT' | 'GOAL' | 'ASSIST';
  substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
}

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
  matchEvents?: MatchEvent[];
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

  const formDataResult = handleValidateFormData(params);
  if ('errors' in formDataResult) {
    return formDataResult;
  }

  const {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date,
    opponentStrength,
    matchEvents,
  } = formDataResult;

  const competitionError = await handleValidateCompetitionMatch(
    trainingMatch,
    pouleOpponentId
  );
  if (competitionError) {
    return competitionError;
  }

  return await handleProcessMatchCreation({
    trainingMatch,
    pouleOpponentId: trainingMatch ? null : pouleOpponentId,
    opponentName: trainingMatch ? opponentName : null,
    date,
    opponentStrength: opponentStrength ?? null,
    matchEvents: matchEvents ?? [],
  });
}

function handleValidateFormData(params: FormData):
  | { errors: ZodIssue[] }
  | {
      trainingMatch: boolean;
      pouleOpponentId: number | null;
      opponentName: string | null;
      date: string;
      opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
      matchEvents?: MatchEvent[];
    } {
  const validation = handleValidateMatchData(params);
  if (!validation.success || !validation.data) {
    console.log('Validation failed:', validation);
    return formatError(validationFailedMessage, ['form']);
  }

  const {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date,
    opponentStrength,
    matchEvents,
  } = validation.data;

  return {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date: date ?? '',
    opponentStrength,
    matchEvents,
  };
}

async function handleValidateCompetitionMatch(
  trainingMatch: boolean,
  pouleOpponentId: number | null
): Promise<{ errors?: ZodIssue[] } | null> {
  return await handleValidateAndHandleCompetitionMatch(
    trainingMatch,
    pouleOpponentId
  );
}
