import { z } from 'zod';

export const addTrainingSchema = z.object({
  date: z.string(),
  players: z.array(
    z.object({
      userId: z.number(),
      absent: z.boolean(),
    })
  ),
});
