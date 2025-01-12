import { ZodIssue } from 'zod';

import { createMatchSchema } from '@/schemas/matchSchema';
import { MatchFormData } from '@/types/validation-types';

export function handleValidateMatchData(params: FormData): {
  success: boolean;
  data?: MatchFormData;
  errors?: ZodIssue[];
} {
  const data = {
    matchType: params.get('matchType') as 'PRACTICE' | 'COMPETITION',
    pouleOpponentId: params.get('pouleOpponentId')
      ? parseInt(params.get('pouleOpponentId') as string, 10)
      : undefined,
    practiceOpponent: params.get('practiceOpponent'),
    date: params.get('date') as string | null,
  };

  const validation = createMatchSchema.safeParse(data);

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
