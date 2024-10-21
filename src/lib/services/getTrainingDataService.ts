'use server';

import prisma from '@/lib/prisma';
import { Training } from '@/types/training-types';

export async function fetchTrainingData(): Promise<Training[]> {
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
