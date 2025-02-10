'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import {
  avgPlayingTimeHeader,
  playerColumn,
  strongerOpponentColumn,
  similarOpponentColumn,
  weakerOpponentColumn,
  unknownPlayerPlaceholder,
  minutesSuffix,
} from '@/strings/clientStrings';
import { PlayerOpponentStatsTableProps } from '@/types/stats-types';

const PlayerOpponentStatsTable: React.FC<PlayerOpponentStatsTableProps> = ({
  playerStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{avgPlayingTimeHeader}</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">{playerColumn}</th>
                <th className="px-4 py-2 border-b">{strongerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{similarOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{weakerOpponentColumn}</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || unknownPlayerPlaceholder}
                  </td>

                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesStronger) + minutesSuffix}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesSimilar) + minutesSuffix}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesWeaker) + minutesSuffix}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default PlayerOpponentStatsTable;
