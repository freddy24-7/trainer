import React from 'react';

import { SubstitutionDetailsProps } from '@/types/match-types';
import {
  handleSubstitutionChange,
  SubstitutionReason,
} from '@/utils/substitutionUtils';

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
          In
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
          ['TACTICAL', 'FITNESS', 'INJURY', 'OTHER'] as SubstitutionReason[]
        ).map((reason) => (
          <label key={reason} className="flex items-center gap-1">
            <input
              type="radio"
              name={`reason-${player.id}`}
              value={reason || ''}
              checked={currentSub?.substitutionReason === reason}
              onChange={() =>
                handleSubstitutionChange(
                  setSubstitutions,
                  player.id,
                  'substitutionReason',
                  reason as string
                )
              }
            />
            {reason}
          </label>
        ))}
      </div>
    </>
  );
};

export default SubstitutionDetails;
