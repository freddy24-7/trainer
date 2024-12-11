import { z } from 'zod';

import {
  pouleNameRequiredMessage,
  mainTeamNameRequiredMessage,
  opponentNameRequiredMessage,
  minimumOpponentsRequiredMessage,
} from '@/strings/validationStrings';

export const createPouleSchema = z.object({
  pouleName: z.string().min(1, pouleNameRequiredMessage),
  mainTeamName: z.string().min(1, mainTeamNameRequiredMessage),
  opponents: z
    .array(z.string().min(1, opponentNameRequiredMessage))
    .min(1, minimumOpponentsRequiredMessage),
});
