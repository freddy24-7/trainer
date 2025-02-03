import prisma from '@/lib/prisma';
import { UserWithOptionalMatchStats } from '@/types/stats-types';

export async function fetchUsers(
  includeMatchStats = false
): Promise<UserWithOptionalMatchStats[]> {
  return prisma.user.findMany({
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
