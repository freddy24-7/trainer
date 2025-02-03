'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React, { useState, useEffect } from 'react';

import { TrainingAbsenceTableProps } from '@/types/training-types';

const TrainingAbsenceTable: React.FC<TrainingAbsenceTableProps> = ({
  absenceData,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Training Absences Overview</h2>
        </CardHeader>
        <CardBody>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Training Date</th>
                <th className="px-4 py-2 border-b">Absent Players</th>
              </tr>
            </thead>
            <tbody>
              {absenceData.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{session.date}</td>
                  <td className="px-4 py-2 border-b">{session.absences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default TrainingAbsenceTable;
