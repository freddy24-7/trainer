import prisma from '@/lib/prisma';
import { UserWithOptionalMatchStats } from '@/types/match-types';

export async function getAssistsByPlayerBy() {
  const players = await fetchPlayersWithAssists();

  return players.map((player) => {
    const matchData =
      player.matchPlayers
        ?.map((mp) => {
          if (!mp.match) {
            console.warn(`Match data missing for matchPlayerId: ${mp.id}`);
            return null;
          }

          const assistsInMatch = (player.MatchEvent ?? []).filter(
            (event) =>
              event.matchId === mp.matchId && event.eventType === 'ASSIST'
          ).length;

          return {
            id: mp.matchId,
            date: mp.match.date,
            opponentStrength: mp.match.opponentStrength ?? null,
            minutes: mp.minutes,
            available: mp.available,
            assists: assistsInMatch,
          };
        })
        .filter((match) => match !== null) || [];

    return {
      id: player.id,
      username: player.username,
      matchData,
    };
  });
}

async function fetchPlayersWithAssists(): Promise<
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
