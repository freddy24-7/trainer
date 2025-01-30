import React from 'react';

import { getAssistsByPlayerByOpponent } from '@/app/actions/getAssistsByPlayerByOpponent';
import { getGoalsByPlayerByOpponent } from '@/app/actions/getGoalsByPlayerByOpponent';
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
import {
  PlayerOpponentStatData,
  GoalsByPlayerStatData,
  AssistsByPlayerStatData,
} from '@/types/match-types';
import { formatError } from '@/utils/errorUtils';

export default async function MatchStatsPage(): Promise<React.ReactElement> {
  try {
    const [
      playerStatsResponse,
      matchDataResponse,
      opponentStats,
      goalStats,
      assistStats,
    ] = await Promise.all([
      getPlayerStats(),
      getMatchData(),
      getPlayerOpponentStats(),
      getGoalsByPlayerByOpponent(),
      getAssistsByPlayerByOpponent(),
    ]);

    console.log(
      'Goals By Player By Opponent Response:',
      JSON.stringify(goalStats, null, 2)
    );

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
          initialGoalStats={goalStats as GoalsByPlayerStatData[]}
          initialAssistStats={assistStats as AssistsByPlayerStatData[]}
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
