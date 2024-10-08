import React from 'react';
import { useFormContext } from 'react-hook-form';

import PlayerListWrapper from '@/components/matches/PlayerListWrapper';
import { FormValues, AddMatchFormFieldsProps } from '@/types/types';

import MatchDetailsFields from './MatchDetailsFields';

const AddMatchFormFields: React.FC<AddMatchFormFieldsProps> = ({
  poules,
  players,
  selectedPoule,
  selectedOpponent,
  errors,
  setValue,
}) => {
  const { watch } = useFormContext<FormValues>();

  const playerValues = watch('players');

  return (
    <>
      <MatchDetailsFields
        poules={poules}
        selectedPoule={selectedPoule}
        selectedOpponent={selectedOpponent}
        errors={errors}
      />

      {players.length > 0 && (
        <PlayerListWrapper
          players={players}
          playerValues={playerValues}
          setValue={setValue}
        />
      )}
    </>
  );
};

export default AddMatchFormFields;
