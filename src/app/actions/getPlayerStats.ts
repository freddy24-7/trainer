'use server';

import prisma from '@/lib/prisma';
import { GetPlayerMatchStatsResponse } from '@/lib/types';

export async function getPlayerStats(): Promise<GetPlayerMatchStatsResponse> {
  try {
    const players = await prisma.user.findMany({
      where: {
        role: 'PLAYER',
      },
      select: {
        id: true,
        username: true,
        MatchPlayer: {
          select: {
            minutes: true,
            available: true,
          },
        },
      },
    });

    const playerStats = players.map((player) => {
      const matchesPlayed = player.MatchPlayer.filter(
        (mp) => mp.available
      ).length;

      const totalMinutesPlayed = player.MatchPlayer.reduce((acc, mp) => {
        return mp.available ? acc + mp.minutes : acc;
      }, 0);

      const averagePlayingTime =
        matchesPlayed > 0 ? totalMinutesPlayed / matchesPlayed : 0;

      const absences = player.MatchPlayer.filter((mp) => !mp.available).length;

      return {
        id: player.id,
        username: player.username,
        matchesPlayed,
        averagePlayingTime,
        absences,
      };
    });

    return { success: true, playerStats };
  } catch (error) {
    return { success: false, error: 'Failed to fetch player stats.' };
  }
}
