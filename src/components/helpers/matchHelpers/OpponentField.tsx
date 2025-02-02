import React from 'react';

import OpponentSelector from '@/components/helpers/matchHelpers/OpponentSelector';
import { OpponentFieldProps } from '@/types/match-types';

const OpponentField = ({
  selectedPoule,
  selectedOpponent,
  errors,
  onChange,
}: OpponentFieldProps): React.ReactElement | null =>
  selectedPoule && selectedPoule.opponents.length > 0 ? (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label
          htmlFor="opponent"
          className="block text-sm font-medium text-gray-700"
        >
          Opponent
        </label>
        <div className="relative">
          <OpponentSelector
            opponents={selectedPoule.opponents}
            selectedOpponent={selectedOpponent}
            onOpponentChange={onChange}
          />
        </div>
        {errors.opponent?.message && (
          <span className="text-danger text-sm mt-1">
            {errors.opponent.message}
          </span>
        )}
      </div>
    </div>
  ) : null;

export default OpponentField;
