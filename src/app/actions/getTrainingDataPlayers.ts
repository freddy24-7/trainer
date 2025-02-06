'use server';

import { fetchTrainingDataPlayers } from '@/lib/services/getTrainingPlayerService';
import {
  unknownUsername,
  errorFetchingTrainingData,
} from '@/strings/serverStrings';
import { TrainingDataResponse } from '@/types/training-types';

export async function getTrainingDataPlayers(): Promise<
  TrainingDataResponse[]
> {
  try {
    const trainingData = await fetchTrainingDataPlayers();

    return trainingData.map((training) => ({
      id: training.id,
      date: training.date,
      players: training.trainingPlayers.map((tp) => ({
        id: tp.user.id,
        username: tp.user.username ?? unknownUsername,
        absent: tp.absent,
      })),
    }));
  } catch (error) {
    console.error('Error fetching training data:', error);
    throw new Error(errorFetchingTrainingData);
  }
}
