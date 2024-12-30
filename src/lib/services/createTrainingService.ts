import { Training } from '@prisma/client';
import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  const chosenDate = new Date(`${date}T00:00:00Z`);

  return prisma.training.create({
    data: {
      date: chosenDate,
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
