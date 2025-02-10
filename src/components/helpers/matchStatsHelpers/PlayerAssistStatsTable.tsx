'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import {
  assistsHeaderOpponent,
  playerColumn,
  strongerOpponentColumn,
  similarOpponentColumn,
  weakerOpponentColumn,
  totalAssistsColumn,
  unknownPlayerPlaceholder,
} from '@/strings/clientStrings';
import { PlayerAssistStatsTableProps } from '@/types/stats-types';

const PlayerAssistStatsTable: React.FC<PlayerAssistStatsTableProps> = ({
  assistStats,
}) => {
  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{assistsHeaderOpponent}</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">{playerColumn}</th>
                <th className="px-4 py-2 border-b">{strongerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{similarOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{weakerOpponentColumn}</th>
                <th className="px-4 py-2 border-b">{totalAssistsColumn}</th>
              </tr>
            </thead>
            <tbody>
              {assistStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {player.username || unknownPlayerPlaceholder}
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
