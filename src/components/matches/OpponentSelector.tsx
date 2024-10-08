import React from 'react';

import { OpponentSelectorProps } from '@/types/types';

export default function OpponentSelector({
  opponents,
  selectedOpponent,
  onOpponentChange,
}: OpponentSelectorProps): React.ReactElement {
  return (
    <div>
      <label className="block mb-2 mx-auto text-center">
        Opponent Team:
        <select
          value={selectedOpponent?.id || ''}
          onChange={(e) => onOpponentChange(parseInt(e.target.value, 10))}
          className="input-class w-full p-2 border rounded mt-1 bg-white text-black"
        >
          <option value="" disabled={true}>
            Select an opponent
          </option>
          {opponents.map((opponent) => (
            <option key={opponent.id} value={opponent.id}>
              {opponent.team.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
