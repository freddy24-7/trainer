import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import CustomButton from '@/components/Button';
import FutureDateWarning from '@/components/FutureDateWarning';
import ConfirmationModal from '@/components/helpers/matchHelpers/ConfirmationModal';
import useDisableSubmitButton from '@/hooks/useDisableSubmitButton';
import { useMatchFormHandlers } from '@/hooks/useMatchFormHandlers';
import {
  submittingTextNotice,
  addMatchButtonText,
  confirmSubmissionTitle,
  confirmSubmissionMessage,
} from '@/strings/clientStrings';
import { MatchFormFieldProps } from '@/types/match-types';

import MatchFormFields from './MatchFormFields';

const MatchForm: React.FC<MatchFormFieldProps> = ({
  methods,
  poules,
  players,
  selectedPoule,
  selectedOpponent,
  playerValues,
  errors,
  onSubmit,
  setValue,
  opponentStrength,
  matchEvents = [],
  date,
}) => {
  const currentDate = new Date();

  const selectedDate = date
    ? new Date(new Date(date).setHours(0, 0, 0, 0))
    : null;
  const isFutureDate = !!selectedDate && selectedDate > currentDate;

  const { watch, handleSubmit } = methods;
  const [lineupFinalized, setLineupFinalized] = useState(false);

  const {
    handleFormSubmit,
    handleConfirmSubmission,
    isSubmitting,
    isConfirmationModalOpen,
    setConfirmationModalOpen,
  } = useMatchFormHandlers({ onSubmit });

  const matchType = watch('matchType') as 'competition' | 'practice';

  const isFormValid = Boolean(date && lineupFinalized);

  const { buttonClassName } = useDisableSubmitButton({
    isSubmitting,
    isFutureDate,
    isFormValid,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <MatchFormFields
          matchType={matchType}
          poules={poules}
          players={players}
          errors={errors}
          setValue={setValue}
          opponentStrength={opponentStrength}
          matchEvents={matchEvents}
          playerValues={playerValues}
          selectedPoule={selectedPoule}
          selectedOpponent={selectedOpponent}
          setLineupFinalized={setLineupFinalized}
        />

        <FutureDateWarning isFutureDate={isFutureDate} showToast={false} />

        <CustomButton type="submit" className={buttonClassName}>
          {isSubmitting ? submittingTextNotice : addMatchButtonText}
        </CustomButton>
      </form>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        title={confirmSubmissionTitle}
        message={confirmSubmissionMessage}
      />
    </FormProvider>
  );
};

export default MatchForm;
