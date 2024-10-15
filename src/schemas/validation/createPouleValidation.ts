import { createPouleSchema } from '@/schemas/createPouleSchema';
import { ZodIssue } from 'zod';

export function validatePouleData(params: FormData): {
  success: boolean;
  data?: any;
  errors?: ZodIssue[];
} {
  const validation = createPouleSchema.safeParse({
    pouleName: params.get('pouleName'),
    mainTeamName: params.get('mainTeamName'),
    opponents: params.getAll('opponents') as string[],
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
