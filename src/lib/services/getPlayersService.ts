import prisma from '@/lib/prisma';
import { UserWithOptionalMatchStats } from '@/types/match-types';

export async function fetchPlayers(
  includeMatchStats = false
): Promise<UserWithOptionalMatchStats[]> {
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
            id: true,
            matchId: true,
            userId: true,
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
