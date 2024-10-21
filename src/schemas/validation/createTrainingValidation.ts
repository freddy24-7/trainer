import { ZodIssue } from 'zod';

import { addTrainingSchema } from '@/schemas/trainingSchema';
import { TrainingFormData } from '@/types/training-types';

export function handleValidateTrainingData(params: FormData): {
  success: boolean;
  data?: TrainingFormData;
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
    data: validation.data as TrainingFormData,
  };
}
