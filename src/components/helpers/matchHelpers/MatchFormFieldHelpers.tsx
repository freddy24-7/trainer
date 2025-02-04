import { Button } from '@heroui/react';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import FutureDateWarning from '@/components/FutureDateWarning';
import ConfirmationModal from '@/components/helpers/matchHelpers/ConfirmationModal';
import { useMatchFormHandlers } from '@/hooks/useMatchFormHandlers';
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
  const selectedDate = date ? new Date(date) : null;
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

  const isFormValid = date && lineupFinalized;

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

        <Button
          type="submit"
          className={`mt-4 w-full p-2 rounded ${
            isFormValid && !isSubmitting
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Add Match'}
        </Button>
      </form>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        title="Confirm Submission"
        message="Are you sure you want to submit this match data?"
      />
    </FormProvider>
  );
};

export default MatchForm;
