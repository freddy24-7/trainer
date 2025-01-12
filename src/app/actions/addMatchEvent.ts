'use server';

import { ZodIssue } from 'zod';

import { addMatchEventToDatabase } from '@/lib/services/createMatchEventService';
import { handleValidateMatchEventData } from '@/schemas/validation/addMatchEventValidation';
import {
  validationFailedMessage,
  failedToAddMatchEvent,
} from '@/strings/actionStrings';
import { MatchEventData } from '@/types/validation-types';
import { formatError } from '@/utils/errorUtils';

export default async function addMatchEvent(data: MatchEventData): Promise<{
  success?: boolean;
  errors?: ZodIssue[];
}> {
  const validation = handleValidateMatchEventData(data);

  if (!validation.success || !validation.data) {
    return formatError(validationFailedMessage, ['form']);
  }

  const {
    matchId,
    userId,
    minute,
    eventType,
    substitutionReason,
    playerInId,
    playerOutId,
  } = validation.data;

  try {
    await addMatchEventToDatabase({
      matchId,
      userId,
      minute,
      eventType,
      substitutionReason:
        eventType === 'SUBSTITUTION_IN' || eventType === 'SUBSTITUTION_OUT'
          ? substitutionReason
          : null,
      playerInId: eventType === 'SUBSTITUTION_IN' ? playerInId : null,
      playerOutId: eventType === 'SUBSTITUTION_OUT' ? playerOutId : null,
    });

    return { success: true };
  } catch (error) {
    console.error(failedToAddMatchEvent, error);
    return formatError(failedToAddMatchEvent, ['form']);
  }
}
