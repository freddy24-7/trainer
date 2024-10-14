import React from 'react';
import MatchClient from '@/components/MatchClient';
import OpponentClient from '@/components/OpponentClient';
import { getPlayerStats } from '@/app/actions/getPlayerStats';
import { getMatchData } from '@/app/actions/getMatchData';
import ProtectedLayout from '@/app/ProtectedLayout';
import { formatError } from '@/utils/errorUtils';

export default async function MatchStatsPage() {
  const [playerStatsResponse, matchDataResponse] = await Promise.all([
    getPlayerStats(),
    getMatchData(),
  ]);

  if (!playerStatsResponse.success) {
    const formattedError = formatError(
      playerStatsResponse.error || 'Error loading player statistics',
      ['getPlayerStats']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }

  if (!matchDataResponse.success) {
    const formattedError = formatError(
      matchDataResponse.error || 'Error loading match data',
      ['getMatchData']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }

  const { playerStats } = playerStatsResponse;
  const { matchData } = matchDataResponse;

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <MatchClient playerStats={playerStats} />
        <OpponentClient matchData={matchData} />
      </div>
    </ProtectedLayout>
  );
}
