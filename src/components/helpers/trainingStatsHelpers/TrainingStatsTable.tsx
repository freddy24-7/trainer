'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import {
  trainingAttendanceOverview,
  playerLabel,
  totalTrainingsMissedLabel,
} from '@/strings/clientStrings';
import { TrainingStatsTableProps } from '@/types/training-types';

const TrainingStatsTable: React.FC<TrainingStatsTableProps> = ({
  trainingStats,
}) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            {trainingAttendanceOverview}
          </h2>
        </CardHeader>

        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">{playerLabel}</th>
                <th className="px-4 py-2 border-b">
                  {totalTrainingsMissedLabel}
                </th>
              </tr>
            </thead>

            <tbody>
              {trainingStats.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{player.username}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {player.totalMissed}
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

export default TrainingStatsTable;
