'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

interface PlayerGoalStat {
  id: number;
  username: string | null;
  goalsAgainstStronger: number;
  goalsAgainstSimilar: number;
  goalsAgainstWeaker: number;
  totalGoals: number;
}

interface PlayerGoalStatsTableProps {
  goalStats: PlayerGoalStat[];
}

const PlayerGoalStatsTable: React.FC<PlayerGoalStatsTableProps> = ({
  goalStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Goals Scored Against Different Opponent Strengths
          </h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Player</th>
                <th className="px-4 py-2 border-b">Stronger Opponent</th>
                <th className="px-4 py-2 border-b">Similar Opponent</th>
                <th className="px-4 py-2 border-b">Weaker Opponent</th>
                <th className="px-4 py-2 border-b">Total Goals</th>
              </tr>
            </thead>
            <tbody>
              {goalStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || 'Unknown'}
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
