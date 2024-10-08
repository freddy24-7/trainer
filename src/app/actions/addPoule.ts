'use server';

import { Team, Poule } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import { createPouleSchema } from '@/schemas/createPouleSchema';

function handlePouleDataValidation(
  params: FormData
): ReturnType<typeof createPouleSchema.safeParse> {
  return createPouleSchema.safeParse({
    pouleName: params.get('pouleName'),
    mainTeamName: params.get('mainTeamName'),
    opponents: params.getAll('opponents') as string[],
  });
}

async function getOrCreateTeam(teamName: string): Promise<Team> {
  let team = await prisma.team.findUnique({
    where: { name: teamName },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: teamName,
      },
    });
  }

  return team;
}

async function createOpponentsLinksToPoule(
  opponents: string[],
  pouleId: number
): Promise<void> {
  await Promise.all(
    opponents.map(async (opponentName) => {
      let opponentTeam = await prisma.team.findUnique({
        where: { name: opponentName },
      });

      if (!opponentTeam) {
        opponentTeam = await prisma.team.create({
          data: { name: opponentName },
        });
      }

      await prisma.pouleOpponents.create({
        data: {
          poule: { connect: { id: pouleId } },
          team: { connect: { id: opponentTeam.id } },
        },
      });

      console.log(`Successfully linked opponent: ${opponentName}`);
    })
  );
}

async function createPoule(
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

export default async function createPouleWithOpponents(
  params: FormData
): Promise<{ errors: ZodIssue[] } | void> {
  const validation = handlePouleDataValidation(params);

  if (!validation.success) {
    return { errors: validation.error.issues };
  }

  const { pouleName, mainTeamName, opponents } = validation.data;
  console.log('Received Opponents:', opponents);

  let redirectPath: string | null = null;

  try {
    const mainTeam = await getOrCreateTeam(mainTeamName);
    const poule = await createPoule(pouleName, mainTeam.id);

    console.log('Poule created:', poule);

    if (opponents.length > 0) {
      await createOpponentsLinksToPoule(opponents, poule.id);
    } else {
      console.log('No opponents to process.');
    }

    redirectPath = '/poule-management';
  } catch {
    return {
      errors: [
        {
          message: 'Error creating the poule or linking opponents.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  } finally {
    if (redirectPath) {
      revalidatePath(redirectPath);
      redirect(redirectPath);
    }
  }
  return;
}
