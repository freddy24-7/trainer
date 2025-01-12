import { z } from 'zod';

import {
  invalidPouleOpponentIdMessage,
  invalidDateFormatMessage,
  invalidUserIdMessage,
  invalidMatchIdMessage,
  minutesPositiveNumberMessage,
  minutesWhenAvailableMessage,
  invalidPlayerInIdMessage,
  invalidPlayerOutIdMessage,
} from '@/strings/validationStrings';

export const createMatchSchema = z
  .object({
    matchType: z.enum(['PRACTICE', 'COMPETITION']),
    pouleOpponentId: z
      .number()
      .min(1, invalidPouleOpponentIdMessage)
      .optional(),
    practiceOpponent: z
      .string()
      .min(1, 'Practice opponent name is required')
      .optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: invalidDateFormatMessage,
    }),
  })
  .refine(
    (data) =>
      data.matchType === 'PRACTICE'
        ? !!data.practiceOpponent
        : !!data.pouleOpponentId,
    {
      message:
        'pouleOpponentId is required for COMPETITION, and practiceOpponent is required for PRACTICE',
      path: ['pouleOpponentId', 'practiceOpponent'],
    }
  );

export const addMatchPlayerSchema = z
  .object({
    userId: z.number().min(1, invalidUserIdMessage),
    matchId: z.number().min(1, invalidMatchIdMessage),
    available: z.boolean(),
    minutes: z.number().min(0, minutesPositiveNumberMessage),
  })
  .refine((data) => !(data.available && data.minutes <= 0), {
    message: minutesWhenAvailableMessage,
    path: ['minutes'],
  });

export const addMatchEventSchema = z
  .object({
    matchId: z.number().min(1, invalidMatchIdMessage),
    userId: z.number().min(1, invalidUserIdMessage),
    minute: z.number().min(0, minutesPositiveNumberMessage),
    eventType: z.enum([
      'GOAL',
      'ASSIST',
      'SUBSTITUTION_IN',
      'SUBSTITUTION_OUT',
    ]),
    playerInId: z.number().min(1, invalidPlayerInIdMessage).optional(),
    playerOutId: z.number().min(1, invalidPlayerOutIdMessage).optional(),
    substitutionReason: z
      .enum(['TACTICAL', 'FITNESS', 'INJURY', 'OTHER'])
      .optional(),
  })
  .refine(
    (data) =>
      ['SUBSTITUTION_IN', 'SUBSTITUTION_OUT'].includes(data.eventType)
        ? typeof data.playerInId === 'number' &&
          typeof data.playerOutId === 'number'
        : true,
    {
      message:
        'playerInId and playerOutId must be provided for substitution events',
      path: ['playerInId', 'playerOutId'],
    }
  );
