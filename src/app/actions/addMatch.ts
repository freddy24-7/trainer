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
import { MatchData } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';

export default async function addMatch(
  _prevState: unknown,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validation = handleValidateMatchData(params);

  if (!validation.success || !validation.data) {
    return formatError(validationFailedMessage, ['form']);
  }

  const { matchType, pouleOpponentId, practiceOpponent, date } =
    validation.data as MatchData;

  let parsedDate: Date;
  if (typeof date === 'string') {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return formatError('Invalid date format.', ['date']);
    }
  } else {
    parsedDate = date;
  }

  try {
    if (matchType === 'COMPETITION') {
      if (!pouleOpponentId) {
        return formatError('Poule opponent ID is required for competition.', [
          'pouleOpponentId',
        ]);
      }

      const opponentExists = await handleFindOpponentById(pouleOpponentId);

      if (!opponentExists) {
        return formatError(opponentNotExistMessage, ['pouleOpponentId']);
      }
    } else
      switch ('PRACTICE') {
        case matchType:
          if (!practiceOpponent) {
            return formatError('Practice opponent name is required.', [
              'practiceOpponent',
            ]);
          }
          break;
      }

    const match = await createMatch({
      matchType,
      pouleOpponentId:
        matchType === 'COMPETITION' ? pouleOpponentId : undefined,
      practiceOpponent: matchType === 'PRACTICE' ? practiceOpponent : undefined,
      date: parsedDate,
    });

    return { match: { id: match.id } };
  } catch (error) {
    console.error(failedToCreateMatchMessage, error);
    return formatError(failedToCreateMatchMessage, ['form']);
  }
}
