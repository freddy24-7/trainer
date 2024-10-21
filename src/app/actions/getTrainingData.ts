'use server';

import { fetchTrainingData } from '@/lib/services/getTrainingDataService';
import { GetTrainingDataResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapTrainingData } from '@/utils/mapTrainingData';

export async function getTrainingData(): Promise<GetTrainingDataResponse> {
  try {
    const trainings = await fetchTrainingData();
    const trainingData = handleMapTrainingData(trainings);

    return { success: true, trainingData };
  } catch (error) {
    console.error('Error fetching training data:', error);
    const formattedError = formatError(
      'Failed to fetch training data.',
      ['getTrainingData'],
      'custom',
      true
    );
    return { success: false, error: formattedError.errors[0].message };
  }
}
