import React from 'react';

import { MatchStatsTableProps } from '@/types/match-types';

const MatchStatsTable: React.FC<MatchStatsTableProps> = ({
  totalMatches,
  matchesPlayed,
  avgMinutesPlayed,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Match Statistics
      </h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-black">Statistic</th>
            <th className="px-4 py-2 text-black">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-black">
              Total Matches Played (Team)
            </td>
            <td className="border px-4 py-2 text-black">{totalMatches}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 text-black">Your Matches Played</td>
            <td className="border px-4 py-2 text-black">{matchesPlayed}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 text-black">
              Average Minutes Played
            </td>
            <td className="border px-4 py-2 text-black">
              {avgMinutesPlayed.toFixed(2)} mins
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MatchStatsTable;
