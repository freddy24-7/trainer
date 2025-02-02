import { OpponentStrength } from '@prisma/client';

import prisma from '@/lib/prisma';
import {
  SubstitutionInMatchStats,
  SubstitutionOutStatData,
} from '@/types/match-types';

export async function fetchPlayersWithTacticalSubstitutionsIn(): Promise<
  SubstitutionInMatchStats[]
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
      substitutedIn: {
        where: {
          eventType: 'SUBSTITUTION',
          substitutionReason: 'TACTICAL',
          playerInId: { not: null },
        },
        select: {
          id: true,
          matchId: true,
          eventType: true,
          minute: true,
          substitutionReason: true,
          playerInId: true,
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

interface TacticalSubstitutionMatchData {
  id: number;
  date: Date;
  opponentStrength: OpponentStrength | null;
}

export async function fetchSubstitutionInTactical(): Promise<
  SubstitutionOutStatData[]
> {
  const players = await fetchPlayersWithTacticalSubstitutionsIn();

  return players.map((player) => {
    const matchData: TacticalSubstitutionMatchData[] = (
      player.substitutedIn ?? []
    )
      .map((event) => {
        if (!event.match || !event.match.date) {
          console.warn(`⚠️ Missing match or date for event ${event.id}`);
          return null;
        }

        return {
          id: event.matchId,
          date: event.match.date,
          opponentStrength: event.match.opponentStrength ?? null,
        };
      })
      .filter((item): item is TacticalSubstitutionMatchData => item !== null);

    return {
      id: player.id,
      username: player.username ?? 'Unknown',
      matchData,
    };
  });
}
