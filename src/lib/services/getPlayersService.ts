import prisma from '@/lib/prisma';
import { UserWithOptionalMatchStats } from '@/types/match-types';

export async function fetchPlayers(
  includeMatchStats = false
): Promise<UserWithOptionalMatchStats[]> {
  const result = await prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
      ...(includeMatchStats && {
        matchPlayers: {
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
  console.log('Fetched players:', JSON.stringify(result, null, 2));
  return result;
}
