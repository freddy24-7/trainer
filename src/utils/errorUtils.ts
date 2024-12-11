import { ZodIssue } from 'zod';

import { defaultErrorMessage } from '@/strings/serverStrings';

export function formatError(
  message: string = defaultErrorMessage,
  path: string[] = ['form'],
  code: 'custom' = 'custom',
  includeSuccess = false
): { errors: ZodIssue[]; success?: boolean } {
  const errorObject = {
    errors: [
      {
        message,
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

export function formatStringError(message: string = defaultErrorMessage): {
  success: boolean;
  errors: string;
} {
  return {
    success: false,
    errors: message,
  };
}
