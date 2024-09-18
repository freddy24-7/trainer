// This server component fetches the training data and returns it to the client.

'use server';

import prisma from '@/lib/prisma';
import { GetTrainingDataResponse, TrainingData } from '@/lib/types';

export async function getTrainingData(): Promise<GetTrainingDataResponse> {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        trainingPlayers: {
          where: {
            absent: true,
          },
          include: {
            user: true,
          },
        },
      },
    });

    const trainingData: TrainingData[] = trainings.map((training) => ({
      id: training.id,
      date: training.date.toISOString(),
      absentPlayers: training.trainingPlayers.map(
        (tp) => tp.user.username ?? 'Unknown Player'
      ),
    }));

    return { success: true, trainingData };
  } catch (error) {
    console.error('Error fetching training data:', error);
    return { success: false, error: 'Failed to fetch training data.' };
  }
}
