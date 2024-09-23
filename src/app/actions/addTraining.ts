// This server action is used to add a new training to the database.

'use server';

import prisma from '@/lib/prisma';
import { addTrainingSchema } from '@/schemas/trainingSchema';

export default async function addTraining(params: FormData) {
  const validation = addTrainingSchema.safeParse({
    date: params.get('date'),
    players: params.get('players')
      ? JSON.parse(params.get('players') as string)
      : [],
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const { date, players } = validation.data;

  try {
    const training = await prisma.training.create({
      data: {
        date: new Date(date),
        createdAt: new Date(),
        trainingPlayers: {
          create: players.map((player) => ({
            userId: player.userId,
            absent: player.absent,
          })),
        },
      },
    });

    return { success: true, training };
  } catch (error) {
    return {
      errors: [
        {
          message: 'Failed to create training.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }
}
