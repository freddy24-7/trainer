import React from 'react';

import {
  matchTypeLabel,
  competitionMatchOption,
  practiceMatchOption,
} from '@/strings/clientStrings';
import { MatchTypeSelectionProps } from '@/types/match-types';

const MatchTypeSelection: React.FC<MatchTypeSelectionProps> = ({
  matchType,
  setValue,
}) => {
  return (
    <div>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <label className="block mb-2 text-sm font-medium">
          {matchTypeLabel}
        </label>
      </div>
      <select
        className="w-full p-2 border rounded"
        value={matchType}
        onChange={(e) =>
          setValue('matchType', e.target.value as 'competition' | 'practice')
        }
      >
        <option value="competition">{competitionMatchOption}</option>
        <option value="practice">{practiceMatchOption}</option>
      </select>
    </div>
  );
};

export default MatchTypeSelection;
