// This server action is used to get match data from the database.

'use server';

import prisma from '@/lib/prisma';
import { GetMatchDataResponse, MatchData } from '@/lib/types';

export async function getMatchData(): Promise<GetMatchDataResponse> {
  try {
    const matches = await prisma.match.findMany({
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
    return { success: false, error: 'Failed to fetch match data.' };
  }
}
