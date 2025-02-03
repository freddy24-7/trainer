'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React from 'react';

import { TrainingStatsTableProps } from '@/types/training-types';

const TrainingStatsTable: React.FC<TrainingStatsTableProps> = ({
  trainingStats,
}) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Training Attendance Overview
          </h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Player</th>
                <th className="px-4 py-2 border-b">Total Trainings Missed</th>
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
