import { createMatchSchema } from '@/schemas/matchSchema';
import { ZodIssue } from 'zod';

export function validateMatchData(params: FormData): {
  success: boolean;
  data?: any;
  errors?: ZodIssue[];
} {
  const validation = createMatchSchema.safeParse({
    pouleOpponentId: parseInt(params.get('pouleOpponentId') as string),
    date: params.get('date'),
  });

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
