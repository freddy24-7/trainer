// This server action creates a new poule of teams

'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ZodIssue } from 'zod';
import { createPouleSchema } from '@/schemas/createPouleSchema';

export default async function addPoule(
  _prevState: any,
  params: FormData
): Promise<{ errors: ZodIssue[] } | void> {
  const validation = createPouleSchema.safeParse({
    pouleName: params.get('pouleName'),
    mainTeamName: params.get('mainTeamName'),
    opponents: params.getAll('opponents') as string[],
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const { pouleName, mainTeamName, opponents } = validation.data;
  console.log('Received Opponents:', opponents);

  let redirectPath: string | null = null;

  try {
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

    const poule = await prisma.poule.create({
      data: {
        name: pouleName,
        team: {
          connect: { id: mainTeam.id },
        },
      },
    });

    console.log('Poule created:', poule);

    if (opponents.length === 0) {
      console.log('No opponents to process.');
    } else {
      await Promise.all(
        opponents.map(async (opponentName) => {
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
                poule: { connect: { id: poule.id } },
                team: { connect: { id: opponentTeam.id } },
              },
            });

            console.log(`Successfully linked opponent: ${opponentName}`, link);
          } catch (opponentError) {
            throw new Error(`Failed to add opponent: ${opponentName}`);
          }
        })
      );
    }

    redirectPath = '/poule-management';
  } catch (error) {
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
      revalidatePath(redirectPath); // Revalidate the page to ensure it shows updated data
      redirect(redirectPath);
    }
  }
  return;
}
