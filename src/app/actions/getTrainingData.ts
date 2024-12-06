'use server';

import { fetchTrainingData } from '@/lib/services/getTrainingDataService';
import { errorFetchingTrainingData } from '@/strings/actionStrings';
import { GetTrainingDataResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapTrainingData } from '@/utils/mapTrainingData';

export async function getTrainingData(): Promise<GetTrainingDataResponse> {
  try {
    const trainings = await fetchTrainingData();
    const trainingData = handleMapTrainingData(trainings);

    return { success: true, trainingData };
  } catch (error) {
    console.error(errorFetchingTrainingData, error);
    const formattedError = formatError(
      errorFetchingTrainingData,
      ['getTrainingData'],
      'custom',
      true
    );
    return { success: false, error: formattedError.errors[0].message };
  }
}
