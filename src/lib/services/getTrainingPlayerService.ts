import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function fetchTrainingDataPlayers(): Promise<
  Prisma.TrainingGetPayload<{
    include: {
      trainingPlayers: {
        include: {
          user: {
            select: {
              id: true;
              username: true;
            };
          };
        };
      };
    };
  }>[]
> {
  return prisma.training.findMany({
    include: {
      trainingPlayers: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
}
