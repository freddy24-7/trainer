import prisma from '@/lib/prisma';
import { MatchDataHelper } from '@/types/match-types';

interface MatchData {
  id: number;
  date: Date;
  pouleOpponent: {
    id: number;
    team: {
      id: number;
      name: string;
    } | null;
  } | null;
  matchPlayers: {
    id: number;
    available: boolean;
    user: {
      id: number;
      username: string | null;
    };
  }[];
}

export async function getMatchDataService(): Promise<MatchDataHelper[]> {
  const matches: MatchData[] = await prisma.match.findMany({
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
