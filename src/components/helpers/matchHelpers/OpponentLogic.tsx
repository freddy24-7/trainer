import React from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

import OpponentField from '@/components/helpers/OpponentField';
import PouleField from '@/components/helpers/PouleField';
import { MatchFormValues } from '@/types/match-types';
import { Poule, PouleOpponent } from '@/types/poule-types';

interface OpponentLogicProps {
  matchType: 'competition' | 'practice';
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  poules: Poule[];
  errors: FieldErrors<MatchFormValues>;
  setValue: UseFormSetValue<MatchFormValues>;
}

const OpponentLogic: React.FC<OpponentLogicProps> = ({
  matchType,
  selectedPoule,
  selectedOpponent,
  poules,
  errors,
  setValue,
}) => {
  return (
    <>
      {matchType === 'competition' ? (
        <OpponentField
          selectedPoule={selectedPoule}
          selectedOpponent={selectedOpponent}
          errors={{ opponent: errors.opponent }}
          onChange={(opponentId) => setValue('opponent', opponentId)}
        />
      ) : (
        <div>
          <label
            htmlFor="opponentName"
            className="block mb-2 text-sm font-medium"
          >
            Opponent Name
          </label>
          <input
            id="opponentName"
            type="text"
            onChange={(e) => setValue('opponentName', e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.opponentName ? 'border-red-500' : ''
            }`}
            placeholder="Enter the opponent's name"
          />
          {errors.opponentName?.message && (
            <p className="text-sm text-red-500 mt-1">
              {errors.opponentName.message}
            </p>
          )}
        </div>
      )}

      {matchType === 'competition' && (
        <PouleField
          poules={poules}
          selectedPoule={selectedPoule}
          errors={{ poule: errors.poule }}
          onChange={(pouleId) => setValue('poule', pouleId)}
        />
      )}
    </>
  );
};

export default OpponentLogic;
