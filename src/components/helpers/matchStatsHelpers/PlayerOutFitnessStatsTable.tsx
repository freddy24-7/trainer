'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import {
  fitnessSubstitutionsHeader,
  playerColumn,
  strongerOpponentColumn,
  similarOpponentColumn,
  weakerOpponentColumn,
  totalSubstitutionsColumn,
  unknownPlayerPlaceholder,
} from '@/strings/clientStrings';
import { PlayerSubstitutionStatsTableProps } from '@/types/stats-types';

const PlayerOutFitnessStatsTable: React.FC<
  PlayerSubstitutionStatsTableProps
> = ({ substitutionStats }) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            {fitnessSubstitutionsHeader}
          </h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">{playerColumn}</th>
                <th className="px-4 py-2 border-b">{strongerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{similarOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{weakerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">
                  {totalSubstitutionsColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {substitutionStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || unknownPlayerPlaceholder}
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

export default PlayerOutFitnessStatsTable;
