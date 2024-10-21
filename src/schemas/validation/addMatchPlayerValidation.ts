import { ZodIssue } from 'zod';

import { addMatchPlayerSchema } from '@/schemas/matchSchema';

export interface MatchPlayerData {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}

export function handleValidateMatchPlayerData(data: MatchPlayerData): {
  success: boolean;
  data?: MatchPlayerData;
  errors?: ZodIssue[];
} {
  const validation = addMatchPlayerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  return {
    success: true,
    data: validation.data as MatchPlayerData,
  };
}
