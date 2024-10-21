import { Poule } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function getPoulesWithTeams(): Promise<
  (Poule & {
    team: unknown;
    opponents: {
      team: unknown;
    }[];
  })[]
> {
  try {
    return await prisma.poule.findMany({
      include: {
        team: true,
        opponents: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to load poules');
  }
}
