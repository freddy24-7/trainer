import { ZodIssue } from 'zod';

export function formatError(
  message: string,
  path: string[] = ['form'],
  code: 'custom' = 'custom',
  includeSuccess = false
): { errors: ZodIssue[]; success?: boolean } {
  const errorObject = {
    errors: [
      {
        message: message || 'An error occurred',
        path,
        code,
      } as ZodIssue,
    ],
  };

  if (includeSuccess) {
    return {
      success: false,
      ...errorObject,
    };
  }

  return errorObject;
}

export function formatStringError(message: string): {
  success: boolean;
  errors: string;
} {
  return {
    success: false,
    errors: message || 'An error occurred',
  };
}
