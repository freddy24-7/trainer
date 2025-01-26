import React from 'react';

import OpponentSelector from '@/components/helpers/matchHelpers/OpponentSelector';
import { Poule, PouleOpponent } from '@/types/poule-types';

interface FieldError {
  message?: string;
}

interface Props {
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: { opponent?: FieldError };
  onChange: (opponentId: number) => void;
}

const OpponentField = ({
  selectedPoule,
  selectedOpponent,
  errors,
  onChange,
}: Props): React.ReactElement | null =>
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
