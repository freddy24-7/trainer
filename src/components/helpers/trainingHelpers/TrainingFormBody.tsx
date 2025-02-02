'use client';

import React from 'react';
import { FieldErrors } from 'react-hook-form';

import CustomButton from '@/components/Button';
import DateField from '@/components/DateField';
import TrainingPlayersField from '@/components/helpers/trainingHelpers/TrainingPlayersField';
import {
  submittingButtonText,
  addTrainingButtonText,
} from '@/strings/clientStrings';
import {
  TrainingFormValues,
  TrainingPlayersFieldProps,
} from '@/types/training-types';

interface TrainingFormBodyProps {
  players: TrainingPlayersFieldProps['players'];
  playerValues: TrainingPlayersFieldProps['playerValues'];
  setValue: TrainingPlayersFieldProps['setValue'];
  errors: FieldErrors<TrainingFormValues>;
  date: TrainingFormValues['date'];
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const TrainingFormBody: React.FC<TrainingFormBodyProps> = ({
  players,
  playerValues,
  setValue,
  errors,
  date,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-center">
      <DateField name="date" label="Training Date" errors={errors} />

      <TrainingPlayersField
        players={players}
        playerValues={playerValues}
        setValue={setValue}
      />

      <CustomButton
        type="submit"
        color="primary"
        size="lg"
        isDisabled={!date || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? submittingButtonText : addTrainingButtonText}
      </CustomButton>
    </form>
  );
};

export default TrainingFormBody;
