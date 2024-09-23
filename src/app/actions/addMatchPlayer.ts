// This server action serves as a helper function.

'use server';

import prisma from '@/lib/prisma';
import { addMatchPlayerSchema } from '@/schemas/matchSchema';

export default async function addMatchPlayer(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}) {
  const validation = addMatchPlayerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  const { userId, matchId, minutes, available } = validation.data;

  try {
    await prisma.matchPlayer.create({
      data: {
        userId,
        matchId,
        minutes,
        available,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to add match player to the database.',
    };
  }
}
