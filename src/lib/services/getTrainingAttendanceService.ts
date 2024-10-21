import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function getTrainingAttendanceFromDB(): Promise<
  (User & {
    TrainingPlayer: {
      absent: boolean;
    }[];
  })[]
> {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    include: {
      TrainingPlayer: {
        where: { absent: true },
      },
    },
  });
}
