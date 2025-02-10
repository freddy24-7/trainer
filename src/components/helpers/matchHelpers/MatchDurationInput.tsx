'use client';

import React from 'react';

import { matchDurationLabel } from '@/strings/clientStrings';
import { MatchDurationInputProps } from '@/types/match-types';

const MatchDurationInput: React.FC<MatchDurationInputProps> = ({
  matchDuration,
  onDurationChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDuration = Math.min(
      130,
      Math.max(1, parseInt(e.target.value, 10))
    );
    onDurationChange(newDuration);
  };

  return (
    <div className="mb-4 flex justify-center items-center space-x-2">
      <label className="block font-semibold mb-1">{matchDurationLabel}</label>
      <input
        type="number"
        value={matchDuration}
        onChange={handleChange}
        className="border rounded w-16 p-2"
        min={1}
        max={130}
      />
    </div>
  );
};

export default MatchDurationInput;
