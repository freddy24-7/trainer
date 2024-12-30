import { Training } from '@prisma/client';
import { parseISO, endOfDay } from 'date-fns';

import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  const chosenDate = endOfDay(parseISO(date));

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
