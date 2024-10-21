import { ZodIssue } from 'zod';

import { createPouleSchema } from '@/schemas/createPouleSchema';
import { PouleFormData } from '@/types/poule-types';

export function handleValidatePouleData(params: FormData): {
  success: boolean;
  data?: PouleFormData;
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
    data: validation.data as PouleFormData,
  };
}
