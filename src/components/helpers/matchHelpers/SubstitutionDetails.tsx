import React from 'react';

import {
  handleSubstitutionChange,
  Substitution,
  SubstitutionReason,
} from '@/utils/substitutionUtils';

interface Player {
  id: number;
  username: string;
}

interface SubstitutionDetailsProps {
  player: Player;
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  substitutions: Substitution[];
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
}

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
          Comes In
        </option>
        {players
          .filter((p) => playerStates[p.id] === 'bench')
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
