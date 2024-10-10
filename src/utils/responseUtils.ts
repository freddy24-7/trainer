import { ZodIssue } from 'zod';

import { Player } from '@/type-list/types';

export function createSuccessResponse(players: Player[]): {
  success: boolean;
  players: Player[];
} {
  return { success: true, players };
}

export function handleError(message: string): {
  errors: string[];
  success?: boolean;
} {
  return {
    errors: [message],
    success: false,
  };
}

export function createValidationErrorResponse(
  message: string,
  path: string
): { errors: ZodIssue[] } {
  return {
    errors: [
      {
        message,
        path: [path],
        code: 'custom',
      },
    ],
  };
}
