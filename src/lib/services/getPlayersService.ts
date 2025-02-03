import prisma from '@/lib/prisma';
import { UserWithOptionalMatchStats } from '@/types/stats-types';

export async function fetchPlayers(): Promise<UserWithOptionalMatchStats[]> {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
      matchPlayers: {
        select: {
          id: true,
          matchId: true,
          userId: true,
          minutes: true,
          available: true,
          match: {
            select: {
              id: true,
              date: true,
              opponentStrength: true,
            },
          },
        },
      },
      MatchEvent: {
        select: {
          id: true,
          eventType: true,
          minute: true,
          matchId: true,
          substitutionReason: true,
        },
      },
    },
  });
}
