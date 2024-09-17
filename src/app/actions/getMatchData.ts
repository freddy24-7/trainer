// This server action is used to get match data from the database.

'use server';

import prisma from '@/lib/prisma';

type MatchData = {
  id: number;
  date: Date;
  opponentTeamName: string;
  absentPlayers: string[];
};

type GetMatchDataResponse =
  | { success: true; matchData: MatchData[] }
  | { success: false; error: string };

export async function getMatchData(): Promise<GetMatchDataResponse> {
  try {
    const matches = await prisma.match.findMany({
      include: {
        pouleOpponent: {
          include: {
            team: true, // Opponent team
          },
        },
        matchPlayers: {
          where: {
            available: false, // Absent players
          },
          include: {
            user: true, // Player details
          },
        },
      },
    });

    const matchData: MatchData[] = matches.map((match) => ({
      id: match.id,
      date: match.date,
      opponentTeamName: match.pouleOpponent.team?.name ?? 'Unknown Opponent',
      absentPlayers: match.matchPlayers.map(
        (mp) => mp.user.username ?? 'Unknown Player'
      ),
    }));

    return { success: true, matchData };
  } catch (error) {
    console.error('Error fetching match data:', error);
    return { success: false, error: 'Failed to fetch match data.' };
  }
}
