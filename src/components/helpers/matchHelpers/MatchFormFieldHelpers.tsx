import React from 'react';
import { FormProvider } from 'react-hook-form';

import DateField from '@/components/helpers/DateField';
import PlayerManagement from '@/components/helpers/matchHelpers/MatchPlayerManagement';
import MatchTypeSelection from '@/components/helpers/matchHelpers/MatchTypeSelection';
import OpponentLogic from '@/components/helpers/matchHelpers/OpponentLogic';
import { Button } from '@/components/ui/button';
import { MatchFormFieldProps } from '@/types/match-types';

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
}) => {
  const { watch, handleSubmit } = methods;
  const matchType = watch('matchType') as 'competition' | 'practice';

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MatchTypeSelection matchType={matchType} setValue={setValue} />

        <OpponentLogic
          matchType={matchType}
          selectedPoule={selectedPoule}
          selectedOpponent={selectedOpponent}
          errors={errors}
          setValue={setValue}
          poules={poules}
        />

        <DateField
          errors={errors}
          onChange={(date) => setValue('date', date)}
        />

        {players.length > 0 && (
          <PlayerManagement
            players={players}
            playerValues={playerValues}
            setValue={setValue}
          />
        )}

        <Button
          type="submit"
          className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Add Match
        </Button>
      </form>
    </FormProvider>
  );
};

export default MatchForm;
