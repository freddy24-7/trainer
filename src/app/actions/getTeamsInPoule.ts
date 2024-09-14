// This server action is used to get the teams in a poule.

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
    });

    if (poules.length === 0) {
      return {
        success: false,
        error: 'No poules found. Please create a new poule.',
      };
    }

    const formattedPoules = poules.map((poule) => ({
      pouleName: poule.name,
      teams: [poule.team, ...poule.opponents.map((opponent) => opponent.team)],
    }));

    return {
      success: true,
      poules: formattedPoules,
    };
  } catch (error) {
    console.error('Error fetching teams in poules:', error);
    return {
      success: false,
      error: 'Failed to load teams in the poules.',
    };
  }
}
