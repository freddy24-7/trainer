// This component displays a table of player attendance data, including player names and their absences.

import React from 'react';
import { TrainingAttendanceClientProps } from '@/lib/types';

const TrainingAttendanceClient: React.FC<TrainingAttendanceClientProps> = ({
  attendanceList,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {attendanceList.length === 0 ? (
        <p>No player attendance data found.</p>
      ) : (
        <table className="min-w-full table-auto bg-white shadow-md rounded-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-700">Player Name</th>
              <th className="px-4 py-2 text-gray-700">Absences</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((player) => (
              <tr key={player.playerId} className="text-center text-gray-700">
                <td className="border px-4 py-2">{player.username}</td>
                <td className="border px-4 py-2">{player.absences}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainingAttendanceClient;
