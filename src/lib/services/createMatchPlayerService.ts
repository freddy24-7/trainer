import { MatchPlayer } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function addMatchPlayerToDatabase(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}): Promise<MatchPlayer> {
  try {
    // Log the data object to understand what is being passed
    console.log('Attempting to create MatchPlayer with data:', data);

    // Call Prisma to create the MatchPlayer
    return await prisma.matchPlayer.create({
      data: {
        userId: data.userId,
        matchId: data.matchId,
        minutes: data.minutes,
        available: data.available,
      },
    });
  } catch (error) {
    // Log any errors that occur during the database operation
    console.error('Error while creating MatchPlayer:', error);
    throw error; // Rethrow the error so it can be handled upstream
  }
}
