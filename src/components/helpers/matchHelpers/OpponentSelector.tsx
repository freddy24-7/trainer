import React from 'react';

import {
  opponentTeamLabel,
  selectOpponentPlaceholder,
} from '@/strings/clientStrings';
import { OpponentSelectorProps } from '@/types/poule-types';

export default function OpponentSelector({
  opponents,
  selectedOpponent,
  onOpponentChange,
}: OpponentSelectorProps): React.ReactElement {
  return (
    <div>
      <label className="block mb-2 mx-auto text-center">
        {opponentTeamLabel}

        <select
          value={selectedOpponent?.id || ''}
          onChange={(e) => onOpponentChange(parseInt(e.target.value, 10))}
          className="input-class w-full p-2 border rounded mt-1 bg-white text-black"
        >
          <option value="" disabled={true}>
            {selectOpponentPlaceholder}
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
