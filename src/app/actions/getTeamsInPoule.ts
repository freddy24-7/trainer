// This server action fetches the teams in a poule.

'use server';

import prisma from '@/lib/prisma';

export async function getTeamsInPoule() {
  try {
    const poules = await prisma.poule.findMany({
      include: {
        team: true,
        opponents: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (poules.length === 0) {
      return {
        success: false,
        error: 'No poules found. Please create a new poule.',
      };
    }

    const formattedPoules = poules.map((poule) => ({
      id: poule.id,
      pouleName: poule.name,
      teams: [poule.team, ...poule.opponents.map((opponent) => opponent.team)],
      opponents: poule.opponents.map((opponent) => ({
        id: opponent.id,
        team: opponent.team,
      })),
    }));

    return {
      success: true,
      poules: formattedPoules,
      latestPoule: formattedPoules[0],
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to load teams in the poules.',
    };
  }
}
