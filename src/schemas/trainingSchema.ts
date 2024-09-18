import { z } from 'zod';

// Defining the schema for adding a training session
export const addTrainingSchema = z.object({
  date: z.string(),
  players: z.array(
    z.object({
      userId: z.number(),
      absent: z.boolean(),
    })
  ),
});
