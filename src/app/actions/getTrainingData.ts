'use server';

import { fetchTrainingData } from '@/lib/services/getTrainingDataService';
import { mapTrainingData } from '@/utils/mapTrainingData';
import { formatError } from '@/utils/errorUtils';
import { GetTrainingDataResponse } from '@/types/response-types';

export async function getTrainingData(): Promise<GetTrainingDataResponse> {
  try {
    const trainings = await fetchTrainingData();
    const trainingData = mapTrainingData(trainings);

    return { success: true, trainingData };
  } catch (error) {
    const formattedError = formatError(
      'Failed to fetch training data.',
      ['getTrainingData'],
      'custom',
      true
    );
    return { success: false, error: formattedError.errors[0].message };
  }
}
