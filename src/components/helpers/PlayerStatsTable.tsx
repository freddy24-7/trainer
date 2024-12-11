import React from 'react';

import {
  playerNameHeader,
  matchesPlayedHeader,
  avgPlayingTimeHeader,
  absencesHeader,
  unknownPlayerPlaceholder,
} from '@/strings/clientStrings';
import { PlayerStatsTableProps } from '@/types/user-types';

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ playerStats }) => {
  return (
    <>
      <thead>
        <tr>
          <th className="px-4 py-2">{playerNameHeader}</th>
          <th className="px-4 py-2">{matchesPlayedHeader}</th>
          <th className="px-4 py-2">{avgPlayingTimeHeader}</th>
          <th className="px-4 py-2">{absencesHeader}</th>
        </tr>
      </thead>
      <tbody>
        {playerStats.map((player) => (
          <tr key={player.id} className="text-center">
            <td className="border px-4 py-2">
              {player.username ?? unknownPlayerPlaceholder}
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
