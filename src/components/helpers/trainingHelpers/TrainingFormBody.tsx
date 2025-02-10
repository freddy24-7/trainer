import React from 'react';

import CustomButton from '@/components/Button';
import DateField from '@/components/DateField';
import FutureDateWarning from '@/components/FutureDateWarning';
import TrainingPlayersField from '@/components/helpers/trainingHelpers/TrainingPlayersField';
import useDisableSubmitButton from '@/hooks/useDisableSubmitButton';
import {
  submittingButtonText,
  addTrainingButtonText,
  trainingDateLabel,
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

  const isFormValid = !!date;

  const isButtonDisabled = useDisableSubmitButton({
    isSubmitting,
    isFutureDate,
    isFormValid,
  });

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

  const buttonClassName = `mt-4 w-full p-2 rounded ${
    isButtonDisabled
      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-center relative">
      <DateField name="date" label={trainingDateLabel} errors={errors} />
      <TrainingPlayersField
        players={players}
        playerValues={playerValues}
        setValue={setValue}
      />

      <FutureDateWarning isFutureDate={isFutureDate} showToast={false} />

      <CustomButton
        type="submit"
        disabled={isButtonDisabled}
        className={buttonClassName}
        isLoading={isSubmitting}
      >
        {isSubmitting ? submittingButtonText : addTrainingButtonText}
      </CustomButton>
    </form>
  );
};

export default TrainingFormBody;
