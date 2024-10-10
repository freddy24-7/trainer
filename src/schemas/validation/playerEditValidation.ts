import { ZodIssue } from 'zod';

import { editPlayerSchema } from '@/schemas/editPlayerSchema';
import { handleValidateFormData } from '@/utils/handleValidateFormData';

export function handleValidateParams(params: FormData): {
  errors: ZodIssue[];
  data?: { username: string; password?: string; whatsappNumber: string };
} {
  return handleValidateFormData(editPlayerSchema, params);
}
