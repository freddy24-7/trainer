'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import {
  goalsHeaderOpponent,
  playerColumn,
  strongerOpponentColumn,
  similarOpponentColumn,
  weakerOpponentColumn,
  totalGoalsColumn,
  unknownPlayerPlaceholder,
} from '@/strings/clientStrings';
import { PlayerGoalStatsTableProps } from '@/types/stats-types';

const PlayerGoalStatsTable: React.FC<PlayerGoalStatsTableProps> = ({
  goalStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{goalsHeaderOpponent}</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">{playerColumn}</th>
                <th className="px-4 py-2 border-b">{strongerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{similarOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{weakerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{totalGoalsColumn}</th>
              </tr>
            </thead>
            <tbody>
              {goalStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || unknownPlayerPlaceholder}
                  </td>

                  <td className="px-4 py-2 border-b">
                    {player.goalsAgainstStronger}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.goalsAgainstSimilar}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.goalsAgainstWeaker}
                  </td>
                  <td className="px-4 py-2 border-b font-bold">
                    {player.totalGoals}
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

export default PlayerGoalStatsTable;
