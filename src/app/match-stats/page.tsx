import React from 'react';

import { getMatchData } from '@/app/actions/getMatchData';
import { getPlayerStats } from '@/app/actions/getPlayerStats';
import MatchStatsWrapper from '@/components/helpers/statsHelpers/MatchStatsWrapper';
import ProtectedLayout from '@/app/ProtectedLayout';
import {
  errorLoadingPlayerStatistics,
  errorLoadingMatchData,
  unknownErrorOccurred,
} from '@/strings/serverStrings';
import { formatError } from '@/utils/errorUtils';

export default async function MatchStatsPage(): Promise<React.ReactElement> {
  try {
    const [playerStatsResponse, matchDataResponse] = await Promise.all([
      getPlayerStats(),
      getMatchData(),
    ]);

    if (!playerStatsResponse.success) {
      const formattedError = formatError(
        playerStatsResponse.error || errorLoadingPlayerStatistics,
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
        matchDataResponse.error || errorLoadingMatchData,
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
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Match Statistics
          </h1>
          <MatchStatsWrapper
            initialPlayerStats={playerStats}
            initialMatchData={matchData}
          />
        </div>
      </ProtectedLayout>
    );
  } catch (error) {
    const formattedError = formatError(
      error instanceof Error ? error.message : unknownErrorOccurred,
      ['MatchStatsPage']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }
}
