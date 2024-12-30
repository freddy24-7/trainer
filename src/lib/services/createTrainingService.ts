import { Training } from '@prisma/client';

import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  const chosenDate = new Date(date);

  const year = chosenDate.getFullYear();
  const month = chosenDate.getMonth();
  const day = chosenDate.getDate();

  const forcedUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));

  return prisma.training.create({
    data: {
      date: forcedUTC,
      createdAt: new Date(),
      trainingPlayers: {
        create: players.map((player) => ({
          userId: player.userId,
          absent: player.absent,
        })),
      },
    },
  });
}
