import React from 'react';

import { getTrainingDataPlayers } from '@/app/actions/getTrainingDataPlayers';
import ProtectedLayout from '@/app/ProtectedLayout';
import TrainingStatsWrapper from '@/components/helpers/trainingStatsHelpers/TrainingStatsWrapper';
import { unknownErrorOccurred } from '@/strings/serverStrings';
import { formatError } from '@/utils/errorUtils';

interface TrainingPlayer {
  id: number;
  username: string | null;
  absent: boolean;
}

interface TrainingData {
  id: number;
  date: Date;
  players: TrainingPlayer[];
}

export default async function TrainingStatsPage(): Promise<React.ReactElement> {
  try {
    const trainingDataResponse: TrainingData[] =
      await getTrainingDataPlayers();

    console.log(
      'Fetched Training Data:',
      JSON.stringify(trainingDataResponse, null, 2)
    );

    if (!Array.isArray(trainingDataResponse)) {
      const formattedError = formatError('Error loading training data', [
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
