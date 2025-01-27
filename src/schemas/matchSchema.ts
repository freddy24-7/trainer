import { z } from 'zod';

import {
  invalidUserIdMessage,
  minutesPositiveNumberMessage,
  minutesWhenAvailableMessage,
} from '@/strings/validationStrings';

export const matchEventSchema = z
  .object({
    playerInId: z.number().min(1, 'Invalid player-in ID').nullable().optional(),
    playerOutId: z
      .number()
      .min(1, 'Invalid player-out ID')
      .nullable()
      .optional(),
    playerId: z.number().min(1, 'Invalid player ID').nullable(),
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
      message: 'playerId is required for GOAL and ASSIST events',
      path: ['playerId'],
    }
  )
  .refine(
    (data) =>
      !['SUBSTITUTION'].includes(data.eventType) ||
      (data.minute !== null && data.minute !== undefined),
    {
      message: 'Minutes are required for substitutions',
      path: ['minute'],
    }
  );

export const createMatchSchema = z
  .object({
    trainingMatch: z.boolean(),
    pouleOpponentId: z
      .number()
      .min(1, 'Invalid Poule Opponent ID')
      .nullable()
      .optional(),
    opponentName: z
      .string()
      .min(1, 'Opponent name must be at least 1 character')
      .nullable(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    players: z
      .array(
        z.object({
          id: z.number().min(1, 'Invalid player ID'),
          minutes: z.number().min(0, 'Minutes must be non-negative'),
          available: z.boolean(),
        })
      )
      .nonempty('At least one player must be present'),
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
      message:
        'Opponent name is required when Poule Opponent ID is not provided',
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
      message: 'Poule Opponent ID is required for competition matches',
      path: ['pouleOpponentId'],
    }
  );

export const addMatchPlayerSchema = z
  .object({
    userId: z.number().min(1, invalidUserIdMessage),
    matchId: z.number().min(1, 'Invalid matchId'),
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
