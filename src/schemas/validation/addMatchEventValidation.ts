import { ZodIssue } from 'zod';

import { addMatchEventSchema } from '@/schemas/matchSchema';
import { MatchEventData } from '@/types/validation-types';

export function handleValidateMatchEventData(data: MatchEventData): {
  success: boolean;
  data?: MatchEventData;
  errors?: ZodIssue[];
} {
  const validation = addMatchEventSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  return {
    success: true,
    data: validation.data,
  };
}
