import prisma from '@/lib/prisma';
import { MatchDataHelper, ObtainMatchData } from '@/types/match-types';

export async function getMatchDataService(): Promise<MatchDataHelper[]> {
  const matches: ObtainMatchData[] = await prisma.match.findMany({
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

  return matches.map((match) => ({
    id: match.id,
    date: match.date,
    pouleOpponent: {
      team: match.pouleOpponent?.team ?? { name: null },
    },
    matchPlayers: match.matchPlayers.map((mp) => ({
      user: {
        username: mp.user?.username ?? null,
      },
    })),
  }));
}
