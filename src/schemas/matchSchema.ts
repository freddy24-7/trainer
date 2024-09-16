import { z } from 'zod';

// Schema for match creation form validation
export const createMatchSchema = z.object({
  pouleOpponentId: z.number().min(1, 'Invalid Poule Opponent ID'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

// Schema for match player addition
export const addMatchPlayerSchema = z.object({
  userId: z.number().min(1, 'Invalid User ID'),
  matchId: z.number().min(1, 'Invalid Match ID'),
  minutes: z.number().min(0, 'Minutes played must be a positive number'),
  available: z.boolean(),
});
