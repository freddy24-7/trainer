import { ZodIssue } from 'zod';

import { createMatchSchema } from '@/schemas/matchSchema';
import { MatchFormData } from '@/types/validation-types';

export function handleValidateMatchData(params: FormData): {
  success: boolean;
  data?: MatchFormData;
  errors?: ZodIssue[];
} {
  const validation = createMatchSchema.safeParse({
    pouleOpponentId: parseInt(params.get('pouleOpponentId') as string, 10),
    date: params.get('date') as string | null,
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  return {
    success: true,
    data: validation.data as MatchFormData,
  };
}
