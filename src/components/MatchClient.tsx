// This component is used to display player statistics.

'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { MatchClientProps } from '@/lib/types';

const MatchClient: React.FC<MatchClientProps> = ({ playerStats }) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Player Statistics</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
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
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default MatchClient;
