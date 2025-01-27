'use client';

import { Button } from '@heroui/react';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

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
      <DateField
        errors={errors}
        label="Training Date"
        onChange={(selectedDate) => setValue('date', selectedDate)}
      />

      <TrainingPlayersField
        players={players}
        playerValues={playerValues}
        setValue={setValue}
      />

      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full"
        isDisabled={!date || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? submittingButtonText : addTrainingButtonText}
      </Button>
    </form>
  );
};

export default TrainingFormBody;
