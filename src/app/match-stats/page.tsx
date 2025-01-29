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
    // Fetch all necessary data in parallel
    const [playerStatsResponse, matchDataResponse, opponentStats] =
      await Promise.all([
        getPlayerStats(),
        getMatchData(),
        getPlayerOpponentStats(),
      ]);

    // console.log(
    //   'Opponent Stats Response:',
    //   JSON.stringify(opponentStats, null, 2)
    // );
    console.log(
      'PlayerStats Response:',
      JSON.stringify(playerStatsResponse, null, 2)
    );

    // Check for errors in player stats
    if (!Array.isArray(playerStatsResponse)) {
      const formattedError = formatError(
        playerStatsResponse?.error || errorLoadingPlayerStatistics,
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

    // Check for errors in match data
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

    return (
      <ProtectedLayout requiredRole="TRAINER">
        <MatchStatsWrapper
          initialPlayerStats={playerStatsResponse}
          initialMatchData={matchDataResponse.matchData}
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
