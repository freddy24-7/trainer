import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function getTrainingAttendanceFromDB(): Promise<
  (User & {
    trainingPlayers: {
      absent: boolean;
    }[];
  })[]
> {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    include: {
      trainingPlayers: {
        where: { absent: true },
      },
    },
  });
}
