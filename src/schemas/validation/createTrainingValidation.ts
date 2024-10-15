import { addTrainingSchema } from '@/schemas/trainingSchema';
import { ZodIssue } from 'zod';

export function validateTrainingData(params: FormData): {
  success: boolean;
  data?: any;
  errors?: ZodIssue[];
} {
  const validation = addTrainingSchema.safeParse({
    date: params.get('date'),
    players: params.get('players')
      ? JSON.parse(params.get('players') as string)
      : [],
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
