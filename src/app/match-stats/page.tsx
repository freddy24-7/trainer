import React from 'react';

import { getMatchData } from '@/app/actions/getMatchData';
import { getPlayerOpponentStats } from '@/app/actions/getPlayerOpponentStats';
import { getPlayerStats } from '@/app/actions/getPlayerStats';
import ProtectedLayout from '@/app/ProtectedLayout';
import MatchStatsWrapper from '@/components/helpers/matchStatsHelpers/MatchStatsWrapper';
import {
  errorLoadingPlayerStatistics,
  errorLoadingMatchData,
  unknownErrorOccurred,
} from '@/strings/serverStrings';
import { PlayerOpponentStatData } from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';

export default async function MatchStatsPage(): Promise<React.ReactElement> {
  try {
    const [playerStatsResponse, matchDataResponse, opponentStats] =
      await Promise.all([
        getPlayerStats(),
        getMatchData(),
        getPlayerOpponentStats(),
      ]);

    console.log(
      'Opponent Stats Response:',
      JSON.stringify(opponentStats, null, 2)
    );

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
        <MatchStatsWrapper
          initialPlayerStats={playerStats}
          initialMatchData={matchData}
          initialOpponentStats={opponentStats as PlayerOpponentStatData[]}
        />
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
