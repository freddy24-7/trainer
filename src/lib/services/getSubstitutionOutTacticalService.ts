import prisma from '@/lib/prisma';
import {
  SubstitutionMatchStats,
  SubstitutionOutStatData,
} from '@/types/stats-types';
import { handlePlayerSubstitutionData } from '@/utils/matchStatsUtils';

export async function fetchPlayersWithTacticalSubstitutions(): Promise<
  SubstitutionMatchStats[]
> {
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
      substitutedOut: {
        where: {
          eventType: 'SUBSTITUTION',
          substitutionReason: 'TACTICAL',
          playerOutId: { not: null },
        },
        select: {
          id: true,
          matchId: true,
          eventType: true,
          minute: true,
          substitutionReason: true,
          playerOutId: true,
          match: {
            select: {
              id: true,
              date: true,
              opponentStrength: true,
            },
          },
        },
      },
    },
  });
}

export async function fetchSubstitutionOutTactical(): Promise<
  SubstitutionOutStatData[]
> {
  const players = await fetchPlayersWithTacticalSubstitutions();
  return handlePlayerSubstitutionData(players);
}
