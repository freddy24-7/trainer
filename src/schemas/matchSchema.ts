import { z } from 'zod';

import {
  invalidUserIdMessage,
  minutesPositiveNumberMessage,
  minutesWhenAvailableMessage,
  invalidPlayerInIdMessage,
  invalidPlayerOutIdMessage,
  invalidPlayerIdMessage,
  invalidPouleOpponentIdMessage,
  invalidMatchIdMessage,
  invalidDateFormatMessage,
  opponentNameRequiredMessage,
  pouleOpponentIdRequiredMessage,
  atLeastOnePlayerRequiredMessage,
  minutesRequiredForSubstitutionsMessage,
  playerIdRequiredForGoalAssistMessage,
} from '@/strings/validationStrings';

export const matchEventSchema = z
  .object({
    playerInId: z
      .number()
      .min(1, invalidPlayerInIdMessage)
      .nullable()
      .optional(),
    playerOutId: z
      .number()
      .min(1, invalidPlayerOutIdMessage)
      .nullable()
      .optional(),

    playerId: z.number().min(1, invalidPlayerIdMessage).nullable(),
    minute: z
      .number()
      .min(0, 'Minute must be non-negative')
      .nullable()
      .optional(),
    eventType: z.enum(['SUBSTITUTION', 'GOAL', 'ASSIST']),
    substitutionReason: z
      .enum(['TACTICAL', 'FITNESS', 'INJURY', 'OTHER'])
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      !['GOAL', 'ASSIST'].includes(data.eventType) || data.playerId !== null,
    {
      message: playerIdRequiredForGoalAssistMessage,
      path: ['playerId'],
    }
  )
  .refine(
    (data) =>
      !['SUBSTITUTION'].includes(data.eventType) ||
      (data.minute !== null && data.minute !== undefined),
    {
      message: minutesRequiredForSubstitutionsMessage,
      path: ['minute'],
    }
  );

export const createMatchSchema = z
  .object({
    trainingMatch: z.boolean(),
    pouleOpponentId: z
      .number()
      .min(1, invalidPouleOpponentIdMessage)
      .nullable()
      .optional(),
    opponentName: z
      .string()
      .min(1, 'Opponent name must be at least 1 character')
      .nullable(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: invalidDateFormatMessage,
    }),
    players: z
      .array(
        z.object({
          id: z.number().min(1, 'Invalid player ID'),
          minutes: z.number().min(0, 'Minutes must be non-negative'),
          available: z.boolean(),
        })
      )
      .nonempty(atLeastOnePlayerRequiredMessage),
    opponentStrength: z
      .enum(['STRONGER', 'SIMILAR', 'WEAKER'])
      .nullable()
      .optional(),
    matchEvents: z.array(matchEventSchema).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.pouleOpponentId === null || data.pouleOpponentId === undefined) {
        return (
          typeof data.opponentName === 'string' &&
          data.opponentName.trim() !== ''
        );
      }
      return true;
    },
    {
      message: opponentNameRequiredMessage,

      path: ['opponentName'],
    }
  )
  .refine(
    (data) => {
      if (!data.trainingMatch) {
        return (
          data.pouleOpponentId !== null && data.pouleOpponentId !== undefined
        );
      }
      return true;
    },
    {
      message: pouleOpponentIdRequiredMessage,
      path: ['pouleOpponentId'],
    }
  );

export const addMatchPlayerSchema = z
  .object({
    userId: z.number().min(1, invalidUserIdMessage),
    matchId: z.number().min(1, invalidMatchIdMessage),
    available: z.boolean(),
    minutes: z.number().min(0, minutesPositiveNumberMessage),
  })
  .refine(
    (data) => {
      return !(data.available && data.minutes < 0);
    },
    {
      message: minutesWhenAvailableMessage,
      path: ['minutes'],
    }
  );
