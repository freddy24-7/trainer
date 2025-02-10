import React from 'react';

import {
  substitutionReasonLabel,
  selectSubstitutionReasonPlaceholder,
  substitutionReasonTactical,
  substitutionReasonFitness,
  substitutionReasonInjury,
  substitutionReasonOther,
} from '@/strings/clientStrings';
import { SubstitutionReasonSelectorProps } from '@/types/match-types';

const SubstitutionReasonSelector: React.FC<SubstitutionReasonSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor="substitution-reason" className="block mb-2">
        {substitutionReasonLabel}
      </label>

      <select
        id="substitution-reason"
        value={value || ''}
        onChange={(e) =>
          onChange(
            e.target.value as 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER'
          )
        }
        className="border rounded w-full p-2"
      >
        <option value="" disabled={true}>
          {selectSubstitutionReasonPlaceholder}
        </option>

        <option value="TACTICAL">{substitutionReasonTactical}</option>
        <option value="FITNESS">{substitutionReasonFitness}</option>
        <option value="INJURY">{substitutionReasonInjury}</option>
        <option value="OTHER">{substitutionReasonOther}</option>
      </select>
    </div>
  );
};

export default SubstitutionReasonSelector;
