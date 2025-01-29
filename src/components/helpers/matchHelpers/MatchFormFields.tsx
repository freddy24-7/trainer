import React from 'react';

import DateField from '@/components/DateField';
import PlayerManagement from '@/components/helpers/matchHelpers/MatchPlayerManagement';
import MatchTypeSelection from '@/components/helpers/matchHelpers/MatchTypeSelection';
import OpponentLogic from '@/components/helpers/matchHelpers/OpponentLogic';
import { MatchFormFieldProps } from '@/types/match-types';

interface MatchFormFieldsProps
  extends Pick<
    MatchFormFieldProps,
    | 'poules'
    | 'players'
    | 'errors'
    | 'setValue'
    | 'opponentStrength'
    | 'matchEvents'
    | 'playerValues'
    | 'selectedPoule'
    | 'selectedOpponent'
  > {
  matchType: 'competition' | 'practice';
  setLineupFinalized: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchFormFields: React.FC<MatchFormFieldsProps> = ({
  matchType,
  poules,
  players,
  errors,
  setValue,
  opponentStrength,
  matchEvents,
  playerValues,
  selectedPoule,
  selectedOpponent,
  setLineupFinalized,
}) => {
  return (
    <>
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

      <DateField name="date" label="Match date" errors={errors} />

      {players.length > 0 && (
        <PlayerManagement
          players={players}
          playerValues={playerValues}
          setValue={setValue}
          matchEvents={matchEvents || []}
          onLineupFinalized={setLineupFinalized}
        />
      )}
    </>
  );
};

export default MatchFormFields;
