import React from 'react';

import { PlayerAttendanceTableProps } from '@/types/training-types';

const PlayerAttendanceTable: React.FC<PlayerAttendanceTableProps> = ({
  attendanceList,
}) => {
  if (attendanceList.length === 0) {
    return <p>No player attendance data found.</p>;
  }

  return (
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
  );
};

export default PlayerAttendanceTable;
