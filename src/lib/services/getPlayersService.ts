import prisma from '@/lib/prisma';

export async function fetchPlayers(includeMatchStats = false) {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
      ...(includeMatchStats && {
        MatchPlayer: {
          select: {
            minutes: true,
            available: true,
          },
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
