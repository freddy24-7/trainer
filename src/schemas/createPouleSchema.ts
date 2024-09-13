import { z } from 'zod';

// Schema for validating poule creation input
export const createPouleSchema = z.object({
  pouleName: z.string().min(1, 'Poule name is required'),
  mainTeamName: z.string().min(1, 'Main team name is required'),
  opponents: z.array(z.string().min(1, 'Opponent name is required')),
});
