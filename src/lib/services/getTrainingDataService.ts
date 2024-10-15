'use server';

import prisma from '@/lib/prisma';

export async function fetchTrainingData() {
  return prisma.training.findMany({
    include: {
      trainingPlayers: {
        where: {
          absent: true,
        },
        include: {
          user: true,
        },
      },
    },
  });
}
