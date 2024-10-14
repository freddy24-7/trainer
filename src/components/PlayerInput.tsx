'use client';

import React, { useState } from 'react';
import { PlayerInputProps } from '@/lib/types';

const PlayerInput: React.FC<PlayerInputProps> = ({
  player,
  minutes,
  available,
  onMinutesChange,
  onAvailabilityChange,
}) => {
  const [showCheckbox, setShowCheckbox] = useState(true);

  const handleMinutesChange = (value: string) => {
    onMinutesChange(player.id, value);
    setShowCheckbox(value.trim() === '');
  };

  return (
    <div className="mb-4">
      <span className="mr-4 block mx-auto text-center">{player.username}</span>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          min="0"
          value={minutes || ''}
          onChange={(e) => handleMinutesChange(e.target.value)}
          className="input-class p-1 border rounded w-20 block mx-auto"
          placeholder="Minutes"
        />

        {showCheckbox && (
          <div className="flex justify-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!available}
                onChange={(e) =>
                  onAvailabilityChange(player.id, !e.target.checked)
                }
                className="mr-2"
              />
              Not Available?
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInput;
