'use server';

import prisma from '@/lib/prisma';
import { Team } from '@/types/types';

interface GetTeamsInPouleResponse {
  success: boolean;
  poules?: Array<{
    id: number;
    pouleName: string;
    teams: Team[];
    opponents: Array<{ id: number; team: Team }>;
  }>;
  latestPoule?: {
    id: number;
    pouleName: string;
    teams: Team[];
    opponents: Array<{ id: number; team: Team }>;
  };
  error?: string;
}

export async function getTeamsInPoule(): Promise<GetTeamsInPouleResponse> {
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
      teams: [
        poule.team as Team,
        ...poule.opponents.map((opponent) => opponent.team as Team),
      ],
      opponents: poule.opponents.map((opponent) => ({
        id: opponent.id,
        team: opponent.team as Team,
      })),
    }));

    return {
      success: true,
      poules: formattedPoules,
      latestPoule: formattedPoules[0],
    };
  } catch {
    return {
      success: false,
      error: 'Failed to load teams in the poules.',
    };
  }
}
