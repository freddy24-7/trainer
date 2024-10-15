import React from 'react';
import { TrainingClientProps } from '@/types/type-list';
import TrainingSessionsList from '@/components/helpers/TrainingSessionsList';

const TrainingClient: React.FC<TrainingClientProps> = ({ trainingData }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <TrainingSessionsList trainingData={trainingData} />{' '}
    </div>
  );
};

export default TrainingClient;
