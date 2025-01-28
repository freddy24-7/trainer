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
      // Only fetch these relations if includeMatchStats = true
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
        MatchEvent: {
          select: {
            id: true,
            eventType: true,
            minute: true, // or any other fields you'd like
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
