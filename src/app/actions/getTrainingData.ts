'use server';

import prisma from '@/lib/prisma';
import { GetTrainingDataResponse, TrainingData } from '@/types/type-list';

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
    return { success: false, error: 'Failed to fetch training data.' };
  }
}
