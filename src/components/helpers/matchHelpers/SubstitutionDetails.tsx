import React from 'react';

import {
  substitutionInPlaceholder,
  substitutionReasonTactical,
  substitutionReasonFitness,
  substitutionReasonInjury,
  substitutionReasonOther,
} from '@/strings/clientStrings';
import { SubstitutionDetailsProps } from '@/types/match-types';
import { handleSubstitutionChange } from '@/utils/substitutionUtils';

const SubstitutionDetails: React.FC<SubstitutionDetailsProps> = ({
  player,
  players,
  playerStates,
  substitutions,
  setSubstitutions,
}) => {
  const currentSub = substitutions.find((sub) => sub.playerOutId === player.id);

  return (
    <>
      <select
        className="border rounded p-2"
        value={currentSub?.playerInId || ''}
        onChange={(e) =>
          handleSubstitutionChange(
            setSubstitutions,
            player.id,
            'playerInId',
            e.target.value
          )
        }
      >
        <option value="" disabled={true}>
          {substitutionInPlaceholder}
        </option>

        {players
          .filter(
            (p) =>
              playerStates[p.id] === 'bench' || p.id === currentSub?.playerInId
          )
          .filter(
            (benchPlayer) =>
              !substitutions.some(
                (sub) =>
                  sub.playerInId === benchPlayer.id &&
                  sub.playerInId !== currentSub?.playerInId
              )
          )
          .map((benchPlayer) => (
            <option key={benchPlayer.id} value={benchPlayer.id}>
              {benchPlayer.username}
            </option>
          ))}
      </select>

      <div className="flex gap-2">
        {(
          [
            { key: 'TACTICAL', label: substitutionReasonTactical },
            { key: 'FITNESS', label: substitutionReasonFitness },
            { key: 'INJURY', label: substitutionReasonInjury },
            { key: 'OTHER', label: substitutionReasonOther },
          ] as const
        ).map(({ key, label }) => (
          <label key={key} className="flex items-center gap-1">
            <input
              type="radio"
              name={`reason-${player.id}`}
              value={key}
              checked={currentSub?.substitutionReason === key}
              onChange={() =>
                handleSubstitutionChange(
                  setSubstitutions,
                  player.id,
                  'substitutionReason',
                  key as string
                )
              }
            />
            {label}
          </label>
        ))}
      </div>
    </>
  );
};

export default SubstitutionDetails;
