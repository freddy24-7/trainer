import { addMatchPlayerSchema } from '@/schemas/matchSchema';
import { ZodIssue } from 'zod';

export function validateMatchPlayerData(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}): { success: boolean; data?: any; errors?: ZodIssue[] } {
  const validation = addMatchPlayerSchema.safeParse(data);

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
