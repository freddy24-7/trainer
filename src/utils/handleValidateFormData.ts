import { ZodSchema, ZodIssue } from 'zod';

import { createValidationErrorResponse } from '@/utils/responseUtils';

export function handleValidateFormData<T>(
  schema: ZodSchema<T>,
  params: FormData
): { errors: ZodIssue[]; data?: T } {
  const formDataObject = Array.from(params.entries()).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {}
  );

  const validation = schema.safeParse(formDataObject);

  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return createValidationErrorResponse(
      firstIssue.message,
      firstIssue.path.join('.')
    );
  }

  return { errors: [], data: validation.data };
}
