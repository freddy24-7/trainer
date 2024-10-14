import { z } from 'zod';

export const createPouleSchema = z.object({
  pouleName: z.string().min(1, 'Poule name is required'),
  mainTeamName: z.string().min(1, 'Main team name is required'),
  opponents: z
    .array(z.string().min(1, 'Opponent name is required'))
    .min(1, 'At least one opponent is required'),
});
