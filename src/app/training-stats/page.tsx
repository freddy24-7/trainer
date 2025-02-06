import React from 'react';

import { getTrainingDataPlayers } from '@/app/actions/getTrainingDataPlayers';
import ProtectedLayout from '@/app/ProtectedLayout';
import TrainingStatsWrapper from '@/components/helpers/trainingStatsHelpers/TrainingStatsWrapper';
import {
  unknownErrorOccurred,
  errorLoadingTrainingData,
} from '@/strings/serverStrings';
import { TrainingDataDisplay } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';

export default async function TrainingStatsPage(): Promise<React.ReactElement> {
  try {
    const trainingDataResponse: TrainingDataDisplay[] =
      await getTrainingDataPlayers();

    console.log(
      'Fetched Training Data:',
      JSON.stringify(trainingDataResponse, null, 2)
    );

    if (!Array.isArray(trainingDataResponse)) {
      const formattedError = formatError(errorLoadingTrainingData, [
        'getTrainingDataForPlayers',
      ]);
      return (
        <ProtectedLayout requiredRole="TRAINER">
          <div className="p-6 bg-red-100 text-red-800">
            {formattedError.errors[0].message}
          </div>
        </ProtectedLayout>
      );
    }

    return (
      <ProtectedLayout requiredRole="TRAINER">
        <TrainingStatsWrapper initialTrainingData={trainingDataResponse} />
      </ProtectedLayout>
    );
  } catch (error) {
    const formattedError = formatError(
      error instanceof Error ? error.message : unknownErrorOccurred,
      ['TrainingStatsPage']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }
}
