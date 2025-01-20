'use client';

import React from 'react';

import { Player } from '@/types/user-types';

const PlayerMinutes: React.FC<{
  players: Player[];
  playerMinutes: Record<number, number>;
}> = ({ players, playerMinutes }) => (
  <div className="mt-6">
    <h4 className="text-lg font-semibold mb-2">Player Minutes</h4>
    {players.map((player) => (
      <div key={player.id} className="flex justify-between">
        <p>{player.username}</p>
        <p>{playerMinutes[player.id]} minutes</p>
      </div>
    ))}
  </div>
);

export default PlayerMinutes;
