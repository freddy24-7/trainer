import prisma from '@/lib/prisma';
import {
  UserWithOptionalMatchStats,
  OpponentStrength,
} from '@/types/match-types';

export async function fetchPlayersWithGoals(): Promise<
  UserWithOptionalMatchStats[]
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
      MatchEvent: {
        select: {
          id: true,
          eventType: true,
          minute: true,
          matchId: true,
        },
      },
    },
  });
}

interface GoalMatchData {
  id: number;
  date: Date;
  opponentStrength: OpponentStrength | null;
  minutes: number;
  available: boolean;
  goals: number;
}

export async function fetchGoalsByPlayer(): Promise<
  {
    id: number;
    username: string | null;
    matchData: GoalMatchData[];
  }[]
> {
  const players = await fetchPlayersWithGoals();

  return players.map((player) => {
    const matchData: GoalMatchData[] =
      player.matchPlayers
        ?.map((mp) => {
          if (!mp.match) {
            console.warn(`Match data missing for matchPlayerId: ${mp.id}`);
            return null;
          }

          const goalsInMatch = (player.MatchEvent ?? []).filter(
            (event) =>
              event.matchId === mp.matchId && event.eventType === 'GOAL'
          ).length;

          return {
            id: mp.matchId,
            date: mp.match.date,
            opponentStrength: mp.match.opponentStrength ?? null,
            minutes: mp.minutes,
            available: mp.available,
            goals: goalsInMatch,
          };
        })
        .filter((match): match is GoalMatchData => match !== null) || [];

    return {
      id: player.id,
      username: player.username,
      matchData,
    };
  });
}
