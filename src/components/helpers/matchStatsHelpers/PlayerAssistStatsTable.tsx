'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

interface PlayerAssistStat {
  id: number;
  username: string | null;
  assistsAgainstStronger: number;
  assistsAgainstSimilar: number;
  assistsAgainstWeaker: number;
  totalAssists: number;
}

interface PlayerAssistStatsTableProps {
  assistStats: PlayerAssistStat[];
}

const PlayerAssistStatsTable: React.FC<PlayerAssistStatsTableProps> = ({
  assistStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Assists Against Different Opponent Strengths
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
                <th className="px-4 py-2 border-b">Total Assists</th>
              </tr>
            </thead>
            <tbody>
              {assistStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.assistsAgainstStronger}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.assistsAgainstSimilar}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.assistsAgainstWeaker}
                  </td>
                  <td className="px-4 py-2 border-b font-bold">
                    {player.totalAssists}
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

export default PlayerAssistStatsTable;
