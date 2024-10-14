import prisma from '@/lib/prisma';

export async function getMatchDataService() {
  return prisma.match.findMany({
    include: {
      pouleOpponent: {
        include: {
          team: true,
        },
      },
      matchPlayers: {
        where: {
          available: false,
        },
        include: {
          user: true,
        },
      },
    },
  });
}
