import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';

interface MatchTypeSelectionProps {
  matchType: 'competition' | 'practice';
  setValue: UseFormSetValue<MatchFormValues>;
}

const MatchTypeSelection: React.FC<MatchTypeSelectionProps> = ({
  matchType,
  setValue,
}) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">Match Type</label>
      <select
        className="w-full p-2 border rounded"
        value={matchType}
        onChange={(e) =>
          setValue('matchType', e.target.value as 'competition' | 'practice')
        }
      >
        <option value="competition">Competition Match</option>
        <option value="practice">Practice Match</option>
      </select>
    </div>
  );
};

export default MatchTypeSelection;
