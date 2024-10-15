import prisma from '@/lib/prisma';

export async function createMainTeam(mainTeamName: string) {
  let mainTeam = await prisma.team.findUnique({
    where: { name: mainTeamName },
  });

  if (!mainTeam) {
    mainTeam = await prisma.team.create({
      data: {
        name: mainTeamName,
      },
    });
  }

  return mainTeam;
}

export async function createPoule(pouleName: string, mainTeamId: number) {
  return prisma.poule.create({
    data: {
      name: pouleName,
      team: {
        connect: { id: mainTeamId },
      },
    },
  });
}

export async function addOpponentsToPoule(
  pouleId: number,
  opponents: string[]
) {
  for (const opponentName of opponents) {
    try {
      console.log('Processing opponent:', opponentName);

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

      const link = await prisma.pouleOpponents.create({
        data: {
          poule: { connect: { id: pouleId } },
          team: { connect: { id: opponentTeam.id } },
        },
      });

      console.log(`Successfully linked opponent: ${opponentName}`, link);
    } catch (error) {
      throw new Error(`Failed to add opponent: ${opponentName}`);
    }
  }
}
