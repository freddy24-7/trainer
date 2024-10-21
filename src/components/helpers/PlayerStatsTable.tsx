import React from 'react';

import { PlayerStatsTableProps } from '@/types/user-types';

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ playerStats }) => {
  return (
    <>
      <thead>
        <tr>
          <th className="px-4 py-2">Player Name</th>
          <th className="px-4 py-2">Matches Played</th>
          <th className="px-4 py-2">Avg. Playing Time</th>
          <th className="px-4 py-2">Absences</th>
        </tr>
      </thead>
      <tbody>
        {playerStats.map((player) => (
          <tr key={player.id} className="text-center">
            <td className="border px-4 py-2">
              {player.username ?? 'Unknown Player'}
            </td>
            <td className="border px-4 py-2">{player.matchesPlayed}</td>
            <td className="border px-4 py-2">
              {player.averagePlayingTime.toFixed(2)} mins
            </td>
            <td className="border px-4 py-2">{player.absences}</td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default PlayerStatsTable;
