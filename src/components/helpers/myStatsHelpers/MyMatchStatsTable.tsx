import React from 'react';

import {
  matchStatsHeader,
  statisticColumn,
  valueColumn,
  totalMatchesPlayedLabel,
  yourMatchesPlayedLabel,
  avgMinutesPlayedLabel,
  minutesSuffix,
} from '@/strings/clientStrings';
import { MatchStatsTableProps } from '@/types/stats-types';

const MatchStatsTable: React.FC<MatchStatsTableProps> = ({
  totalMatches,
  matchesPlayed,
  avgMinutesPlayed,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-black">
        {matchStatsHeader}
      </h2>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-black">{statisticColumn}</th>
            <th className="px-4 py-2 text-black">{valueColumn}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-black">
              {totalMatchesPlayedLabel}
            </td>

            <td className="border px-4 py-2 text-black">{totalMatches}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 text-black">
              {yourMatchesPlayedLabel}
            </td>
            <td className="border px-4 py-2 text-black">{matchesPlayed}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 text-black">
              {avgMinutesPlayedLabel}
            </td>

            <td className="border px-4 py-2 text-black">
              {Math.round(avgMinutesPlayed) + minutesSuffix}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MatchStatsTable;
