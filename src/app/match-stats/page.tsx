import React from 'react';

import { getAssistsByPlayer } from '@/app/actions/getAssistsByPlayer';
import { getGoalsByPlayer } from '@/app/actions/getGoalsByPlayer';
import { getMatchData } from '@/app/actions/getMatchData';
import { getPlayerOpponentStats } from '@/app/actions/getPlayerOpponentStats';
import { getPlayerStats } from '@/app/actions/getPlayerStats';
import { getSubstitutionInTactical } from '@/app/actions/getSubstitutionInTactical';
import { getSubstitutionOutFitness } from '@/app/actions/getSubstitutionOutFitness';
import { getSubstitutionOutInjury } from '@/app/actions/getSubstitutionOutInjury';
import { getSubstitutionOutTactical } from '@/app/actions/getSubstitutionOutTactical';
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
  SubstitutionOutStatData,
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
      substitutionStats,
      substitutionInjuryStats,
      substitutionOutTacticalStats,
      substitutionInTacticalStats,
    ] = await Promise.all([
      getPlayerStats(),
      getMatchData(),
      getPlayerOpponentStats(),
      getGoalsByPlayer(),
      getAssistsByPlayer(),
      getSubstitutionOutFitness(),
      getSubstitutionOutInjury(),
      getSubstitutionOutTactical(),
      getSubstitutionInTactical(),
    ]);

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
          initialSubstitutionStats={
            substitutionStats as SubstitutionOutStatData[]
          }
          initialSubstitutionInjuryStats={
            substitutionInjuryStats as SubstitutionOutStatData[]
          }
          initialSubstitutionOutTacticalStats={
            substitutionOutTacticalStats as SubstitutionOutStatData[]
          }
          initialSubstitutionInTacticalStats={
            substitutionInTacticalStats as SubstitutionOutStatData[]
          }
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
