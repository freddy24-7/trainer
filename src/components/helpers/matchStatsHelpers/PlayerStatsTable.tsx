import React from 'react';

import {
  playerNameHeader,
  matchesPlayedHeader,
  avgPlayingTimeHeader,
  absencesHeader,
  unknownPlayerPlaceholder,
} from '@/strings/clientStrings';
import { PlayerStatsTableProps } from '@/types/user-types';

const goalsHeader = 'Goals';
const assistsHeader = 'Assists';

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ playerStats }) => {
  return (
    <>
      <thead>
        <tr>
          <th className="px-4 py-2">{playerNameHeader}</th>
          <th className="px-4 py-2">{matchesPlayedHeader}</th>
          <th className="px-4 py-2">{avgPlayingTimeHeader}</th>
          <th className="px-4 py-2">{absencesHeader}</th>
          <th className="px-4 py-2">{goalsHeader}</th>
          <th className="px-4 py-2">{assistsHeader}</th>
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
              {Math.round(player.averagePlayingTime)} mins
            </td>
            <td className="border px-4 py-2">{player.absences}</td>

            <td className="border px-4 py-2">{player.goals}</td>
            <td className="border px-4 py-2">{player.assists}</td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default PlayerStatsTable;
