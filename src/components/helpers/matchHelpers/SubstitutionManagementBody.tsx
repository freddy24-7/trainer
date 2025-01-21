import React from 'react';

import SubstitutionDetails from '@/components/helpers/matchHelpers/SubstitutionDetails';
import {
  handleAddSubstitution,
  handleRemoveSubstitution,
  Substitution,
} from '@/utils/substitutionUtils';

interface Player {
  id: number;
  username: string;
}

interface SubstitutionManagementBodyProps {
  players: Player[];
  playerStates: Record<number, 'playing' | 'bench' | 'absent'>;
  minute: number | '';
  setMinute: React.Dispatch<React.SetStateAction<number | ''>>;
  substitutions: Substitution[];
  setSubstitutions: React.Dispatch<React.SetStateAction<Substitution[]>>;
}

const SubstitutionManagementBody: React.FC<SubstitutionManagementBodyProps> = ({
  players,
  playerStates,
  minute,
  setMinute,
  substitutions,
  setSubstitutions,
}) => {
  const playersOnPitch = players.filter(
    (player) => playerStates[player.id] === 'playing'
  );

  return (
    <>
      <input
        type="number"
        placeholder="Minute"
        value={minute}
        onChange={(e) => setMinute(Number(e.target.value))}
        className="border rounded w-32 p-2 mb-4 mx-auto"
      />

      {playersOnPitch.map((player) => {
        const isOut = substitutions.some(
          (sub) => sub.playerOutId === player.id
        );

        return (
          <div
            key={player.id}
            className="grid grid-cols-5 items-center gap-4 mb-2"
          >
            <p>{player.username}</p>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOut}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAddSubstitution(setSubstitutions, player.id);
                  } else {
                    handleRemoveSubstitution(setSubstitutions, player.id);
                  }
                }}
              />
              Goes Out
            </label>

            {isOut && (
              <SubstitutionDetails
                player={player}
                players={players}
                playerStates={playerStates}
                substitutions={substitutions}
                setSubstitutions={setSubstitutions}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default SubstitutionManagementBody;
