import React from 'react';
import { TrainingClientProps } from '@/types/training-types';
import TrainingSessionsList from '@/components/helpers/TrainingSessionsList';

const DataTrainingClient: React.FC<TrainingClientProps> = ({
  trainingData,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <TrainingSessionsList trainingData={trainingData} />{' '}
    </div>
  );
};

export default DataTrainingClient;
