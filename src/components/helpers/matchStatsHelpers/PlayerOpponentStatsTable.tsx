'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

interface PlayerOpponentStatsTableProps {
  playerStats: PlayerOpponentStat[];
}

const PlayerOpponentStatsTable: React.FC<PlayerOpponentStatsTableProps> = ({
  playerStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Average Playing time by strength of opponent
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
              </tr>
            </thead>
            <tbody>
              {playerStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesStronger)} mins
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesSimilar)} mins
                  </td>
                  <td className="px-4 py-2 border-b">
                    {Math.round(player.avgMinutesWeaker)} mins
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
