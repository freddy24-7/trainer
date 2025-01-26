import { Button } from '@heroui/react';
import React, { useState } from 'react';
import { FormProvider, SubmitHandler } from 'react-hook-form';

import DateField from '@/components/DateField';
import ConfirmationModal from '@/components/helpers/matchHelpers/ConfirmationModal';
import PlayerManagement from '@/components/helpers/matchHelpers/MatchPlayerManagement';
import MatchTypeSelection from '@/components/helpers/matchHelpers/MatchTypeSelection';
import OpponentLogic from '@/components/helpers/matchHelpers/OpponentLogic';
import { MatchFormFieldProps, MatchFormValues } from '@/types/match-types';

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
}) => {
  const { watch, handleSubmit } = methods;
  const matchType = watch('matchType') as 'competition' | 'practice';

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState<MatchFormValues | null>(null);

  const handleFormSubmit: SubmitHandler<MatchFormValues> = (data) => {
    setFormData(data);
    setConfirmationModalOpen(true);
  };

  const handleConfirmSubmission: () => Promise<void> = async () => {
    setConfirmationModalOpen(false);

    if (formData) {
      try {
        await onSubmit(formData);
        console.log('Match submitted successfully!');
      } catch (error) {
        console.error('Error submitting match data:', error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <MatchTypeSelection matchType={matchType} setValue={setValue} />

        <OpponentLogic
          matchType={matchType}
          selectedPoule={selectedPoule}
          selectedOpponent={selectedOpponent}
          errors={errors}
          setValue={setValue}
          poules={poules}
          opponentStrength={opponentStrength}
        />
        <DateField
          errors={errors}
          label="Match date"
          onChange={(date) => setValue('date', date)}
        />

        {players.length > 0 && (
          <PlayerManagement
            players={players}
            playerValues={playerValues}
            setValue={setValue}
            matchEvents={matchEvents || []}
          />
        )}

        <Button
          type="submit"
          className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Add Match
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
