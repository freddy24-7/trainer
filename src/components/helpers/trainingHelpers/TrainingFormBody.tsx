import React from 'react';

import CustomButton from '@/components/Button';
import DateField from '@/components/DateField';
import FutureDateWarning from '@/components/FutureDateWarning';
import TrainingPlayersField from '@/components/helpers/trainingHelpers/TrainingPlayersField';
import {
  submittingButtonText,
  addTrainingButtonText,
} from '@/strings/clientStrings';
import { TrainingFormBodyProps } from '@/types/training-types';

const TrainingFormBody: React.FC<TrainingFormBodyProps> = ({
  players,
  playerValues,
  setValue,
  errors,
  date,
  isSubmitting,
  onSubmit,
}) => {
  const currentDate = new Date();
  const selectedDate = date ? new Date(date) : null;
  const isFutureDate = !!selectedDate && selectedDate > currentDate;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      await onSubmit(e);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-center relative">
      <DateField name="date" label="Training Date" errors={errors} />
      <TrainingPlayersField
        players={players}
        playerValues={playerValues}
        setValue={setValue}
      />

      <FutureDateWarning isFutureDate={isFutureDate} showToast={false} />

      <CustomButton
        type="submit"
        color="primary"
        size="lg"
        isDisabled={!date || isSubmitting || isFutureDate}
        isLoading={isSubmitting}
      >
        {isSubmitting ? submittingButtonText : addTrainingButtonText}
      </CustomButton>
    </form>
  );
};

export default TrainingFormBody;
