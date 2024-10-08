import { z } from 'zod';

export const createMatchSchema = z.object({
  pouleOpponentId: z.number().min(1, 'Invalid Poule Opponent ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export const addMatchPlayerSchema = z
  .object({
    userId: z.number().min(1, 'Invalid User ID'),
    matchId: z.number().min(1, 'Invalid Match ID'),
    available: z.boolean(),
    minutes: z.number().min(0, 'Minutes must be zero or a positive number'),
  })
  .refine(
    (data) => {
      return !(data.available && data.minutes <= 0);
    },
    {
      message:
        'Minutes must be a positive number when the player is available.',
      path: ['minutes'],
    }
  );
