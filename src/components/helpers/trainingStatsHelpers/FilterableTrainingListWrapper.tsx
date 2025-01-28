'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilterableTrainingList from '@/components/helpers/trainingStatsHelpers/FilterableTrainingList';
import { TrainingData, PlayerAttendance } from '@/types/training-types';

interface FilterableTrainingListWrapperProps {
  trainingData: TrainingData[];
  attendanceList: PlayerAttendance[];
}

const FilterableTrainingListWrapper: React.FC<
  FilterableTrainingListWrapperProps
> = ({ trainingData, attendanceList }) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FilterableTrainingList
        trainingData={trainingData}
        attendanceList={attendanceList}
      />
    </FormProvider>
  );
};

export default FilterableTrainingListWrapper;
