// This server action is used to get the teams in a poule.

'use server';

import prisma from '@/lib/prisma';

export async function getTeamsInPoule() {
  try {
    const poule = await prisma.poule.findFirst({
      include: {
        team: true,
        opponents: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!poule) {
      return {
        success: false,
        error: 'No poule found. Please create a new poule.',
      };
    }

    const teams = [
      poule.team,
      ...poule.opponents.map((opponent) => opponent.team),
    ];

    return {
      success: true,
      pouleName: poule.name,
      teams,
    };
  } catch (error) {
    console.error('Error fetching teams in poule:', error);
    return {
      success: false,
      error: 'Failed to load teams in the poule.',
    };
  }
}
