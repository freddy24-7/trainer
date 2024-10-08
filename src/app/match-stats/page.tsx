import React from 'react';

import { getMatchData } from '@/app/actions/getMatchData';
import { getPlayerStats } from '@/app/actions/getPlayerStats';
import ProtectedLayout from '@/app/protected-layout';
import MatchClient from '@/components/matches/MatchClient';
import OpponentClient from '@/components/matches/OpponentClient';

export default async function MatchStatsPage(): Promise<React.ReactElement> {
  const [playerStatsResponse, matchDataResponse] = await Promise.all([
    getPlayerStats(),
    getMatchData(),
  ]);

  if (!playerStatsResponse.success) {
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          Error loading player statistics: {playerStatsResponse.error}
        </div>
      </ProtectedLayout>
    );
  }

  if (!matchDataResponse.success) {
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          Error loading match data: {matchDataResponse.error}
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
