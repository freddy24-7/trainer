'use server';
import { Training } from '@prisma/client';
import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import { addTrainingSchema } from '@/schemas/trainingSchema';
import { TrainingActionError } from '@/types/types';

function handleZodIssueToTrainingActionError(
  zodIssues: ZodIssue[]
): TrainingActionError[] {
  return zodIssues.map((issue) => ({
    message: issue.message,
    path: Array.isArray(issue.path) ? issue.path.map(String) : [],
  }));
}

export default async function createTraining(params: FormData): Promise<{
  errors?: TrainingActionError[];
  success?: boolean;
  training?: Training;
}> {
  const validation = addTrainingSchema.safeParse({
    date: params.get('date'),
    players: params.get('players')
      ? JSON.parse(params.get('players') as string)
      : [],
  });

  if (!validation.success) {
    return {
      errors: handleZodIssueToTrainingActionError(validation.error.issues),
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
  } catch {
    return {
      errors: [
        {
          message: 'Failed to create training.',
          path: ['form'],
        },
      ],
    };
  }
}
