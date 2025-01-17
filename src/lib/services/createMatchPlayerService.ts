import { MatchPlayer } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function addMatchPlayerToDatabase(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}): Promise<MatchPlayer> {
  console.log('Adding MatchPlayer to database with data:', data);

  if (!data.matchId) {
    console.error('Error: matchId is undefined or invalid:', data);
    throw new Error('matchId is required but was undefined');
  }

  try {
    const matchPlayer = await prisma.matchPlayer.create({
      data: {
        userId: data.userId,
        matchId: data.matchId,
        minutes: data.minutes,
        available: data.available,
      },
    });

    console.log('MatchPlayer created successfully:', matchPlayer);
    return matchPlayer;
  } catch (error) {
    console.error('Error while creating MatchPlayer:', error);
    throw error;
  }
}
