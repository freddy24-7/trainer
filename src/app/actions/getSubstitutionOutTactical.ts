import { OpponentStrength } from '@prisma/client';

import prisma from '@/lib/prisma';
import {
  SubstitutionMatchStats,
  SubstitutionOutStatData,
} from '@/types/match-types';

export async function getSubstitutionOutTactical(): Promise<
  SubstitutionOutStatData[]
> {
  const players = await fetchPlayersWithTacticalSubstitutions();

  return players.map((player) => {
    const matchData = (player.substitutedOut ?? [])
      .map((event) => {
        if (!event.match || !event.match.date) {
          console.warn(`⚠️ Missing match or date for event ${event.id}`);
          return null;
        }

        return {
          id: event.matchId,
          date: event.match.date,
          opponentStrength:
            event.match.opponentStrength ?? (null as OpponentStrength | null),
        };
      })
      .filter(
        (
          item
        ): item is {
          id: number;
          date: Date;
          opponentStrength: OpponentStrength | null;
        } => item !== null
      );

    return {
      id: player.id,
      username: player.username ?? 'Unknown',
      matchData,
    };
  });
}

async function fetchPlayersWithTacticalSubstitutions(): Promise<
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
