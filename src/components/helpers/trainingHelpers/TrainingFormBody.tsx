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

  const { buttonClassName, isButtonDisabled } = useDisableSubmitButton({
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
        className={buttonClassName}
        isLoading={isSubmitting}
        style={{
          color: isButtonDisabled ? '#EF4444' : '#22C55E',
        }}
      >
        {isSubmitting ? submittingButtonText : addTrainingButtonText}
      </CustomButton>
    </form>
  );
};

export default TrainingFormBody;
