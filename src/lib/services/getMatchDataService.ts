import prisma from '@/lib/prisma';

interface MatchData {
  id: number;
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

export async function getMatchDataService(): Promise<MatchData[]> {
  return prisma.match.findMany({
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
}
