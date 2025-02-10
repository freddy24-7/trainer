'use client';

import React from 'react';

import { playerMinutesHeader, minutesLabel } from '@/strings/clientStrings';
import { Player } from '@/types/user-types';

const PlayerMinutes: React.FC<{
  players: Player[];
  playerMinutes: Record<number, number>;
}> = ({ players, playerMinutes }) => (
  <div className="mt-6">
    <h4 className="text-lg font-semibold mb-2">{playerMinutesHeader}</h4>
    {players.map((player) => (
      <div key={player.id} className="flex justify-between">
        <p>{player.username}</p>
        <p>
          {playerMinutes[player.id]} {minutesLabel}
        </p>
      </div>
    ))}
  </div>
);

export default PlayerMinutes;
