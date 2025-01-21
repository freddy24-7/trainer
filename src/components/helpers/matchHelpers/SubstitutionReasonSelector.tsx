import React from 'react';

interface SubstitutionReasonSelectorProps {
  value: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  onChange: (reason: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER') => void;
}

const SubstitutionReasonSelector: React.FC<SubstitutionReasonSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor="substitution-reason" className="block mb-2">
        Substitution Reason:
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
          Select Substitution Reason
        </option>
        <option value="TACTICAL">Tactical</option>
        <option value="FITNESS">Fitness</option>
        <option value="INJURY">Injury</option>
        <option value="OTHER">Other</option>
      </select>
    </div>
  );
};

export default SubstitutionReasonSelector;
