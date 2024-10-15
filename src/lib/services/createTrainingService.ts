import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/type-list';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
) {
  return prisma.training.create({
    data: {
      date: new Date(date),
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
