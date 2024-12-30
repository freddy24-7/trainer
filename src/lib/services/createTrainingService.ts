import { Training } from '@prisma/client';
import { parseISO, startOfDay } from 'date-fns';

import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  const chosenDate = startOfDay(parseISO(date));

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
