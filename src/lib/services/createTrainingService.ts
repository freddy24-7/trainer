import { Training } from '@prisma/client';
import { parseISO, endOfDay, addHours } from 'date-fns';

import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('User timezone:', userTimezone);

  let chosenDate = endOfDay(parseISO(date));

  if (userTimezone === 'UTC') {
    chosenDate = addHours(chosenDate, 12);
  }

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
