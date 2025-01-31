'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

interface PlayerOutInjuryStat {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

interface PlayerSubstitutionInjuryStatsTableProps {
  substitutionStats: PlayerOutInjuryStat[];
}

const PlayerSubstitutionInjuryStatsTable: React.FC<
  PlayerSubstitutionInjuryStatsTableProps
> = ({ substitutionStats }) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Injury-Related Substitutions - Players going out
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
                <th className="px-4 py-2 border-b">Total Substitutions</th>
              </tr>
            </thead>
            <tbody>
              {substitutionStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.substitutionsAgainstStronger}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.substitutionsAgainstSimilar}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {player.substitutionsAgainstWeaker}
                  </td>
                  <td className="px-4 py-2 border-b font-bold">
                    {player.totalSubstitutions}
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

export default PlayerSubstitutionInjuryStatsTable;
