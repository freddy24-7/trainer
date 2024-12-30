import { Training } from '@prisma/client';
import { parseISO, endOfDay, addHours } from 'date-fns';

import prisma from '@/lib/prisma';
import { PlayerAtTraining } from '@/types/user-types';

export async function createTraining(
  date: string,
  players: PlayerAtTraining[]
): Promise<Training> {
  //This code section below is written to also work in production on vercel, which is given in UTC timezone.
  //As the user in production is in UTC timezone , we need to add hours to the date to make it work in CET.
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
