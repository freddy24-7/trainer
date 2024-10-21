import { Team, Poule } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function createMainTeam(
  mainTeamName: string
): Promise<Team | null> {
  const mainTeam = await prisma.team.findUnique({
    where: { name: mainTeamName },
  });

  if (mainTeam) return mainTeam;

  return prisma.team.create({
    data: { name: mainTeamName },
  });
}

export async function createPoule(
  pouleName: string,
  mainTeamId: number
): Promise<Poule> {
  return prisma.poule.create({
    data: {
      name: pouleName,
      team: {
        connect: { id: mainTeamId },
      },
    },
  });
}

async function handleFindOrCreateTeam(opponentName: string): Promise<Team> {
  let opponentTeam = await prisma.team.findUnique({
    where: { name: opponentName },
  });

  if (!opponentTeam) {
    opponentTeam = await prisma.team.create({
      data: { name: opponentName },
    });
    console.log('Opponent team created:', opponentTeam);
  } else {
    console.log('Opponent team already exists:', opponentTeam);
  }

  return opponentTeam;
}

export async function addOpponentsToPoule(
  pouleId: number,
  opponents: string[]
): Promise<void> {
  for (const opponentName of opponents) {
    try {
      console.log('Processing opponent:', opponentName);

      const opponentTeam = await handleFindOrCreateTeam(opponentName);

      const link = await prisma.pouleOpponents.create({
        data: {
          poule: { connect: { id: pouleId } },
          team: { connect: { id: opponentTeam.id } },
        },
      });

      console.log(`Successfully linked opponent: ${opponentName}`, link);
    } catch (error) {
      console.error(`Failed to add opponent: ${opponentName}`, error);
      throw new Error(`Failed to add opponent: ${opponentName}`);
    }
  }
}
