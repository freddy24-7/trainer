'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchOpponents from '@/components/helpers/matchStatsHelpers/MatchOpponents';
import MatchStats from '@/components/helpers/matchStatsHelpers/MatchStats';
import TableDisplay from '@/components/helpers/matchStatsHelpers/TableDisplay';
import {
  MatchStatsWrapperProps,
  GoalsByPlayerStatData,
} from '@/types/match-types';
import {
  processGoalStats,
  processAssistStats,
} from '@/utils/matchGoalAssistHelpers';
import {
  filterMatchesByDate,
  calculateOpponentStats,
  processPlayerStats,
  processSubstitutionStats,
  processSubstitutionInjuryStats,
  processSubstitutionTacticalStats,
  processSubstitutionInTacticalStats,
} from '@/utils/matchStatsHelpers';

const FilteredMatchStatsPage: React.FC<
  MatchStatsWrapperProps & { initialGoalStats: GoalsByPlayerStatData[] }
> = ({
  initialPlayerStats,
  initialMatchData,
  initialOpponentStats,
  initialGoalStats,
  initialAssistStats,
  initialSubstitutionStats,
  initialSubstitutionInjuryStats,
  initialSubstitutionOutTacticalStats,
  initialSubstitutionInTacticalStats,
}) => {
  const methods = useForm();
  const { watch, setValue } = methods;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const filteredMatches = filterMatchesByDate(
    initialMatchData,
    startDate,
    endDate
  );

  const opponentStatsWithAverages = calculateOpponentStats(
    initialOpponentStats,
    startDate,
    endDate
  );

  const processedPlayerStatsData = processPlayerStats(
    initialPlayerStats,
    startDate,
    endDate
  );

  const processedGoalStatsData = processGoalStats(
    initialGoalStats,
    startDate,
    endDate
  );

  const processedAssistStatsData = processAssistStats(
    initialAssistStats,
    startDate,
    endDate
  );

  const processedSubstitutionStatsData = processSubstitutionStats(
    initialSubstitutionStats,
    startDate,
    endDate
  );

  const processedSubstitutionInjuryStatsData = processSubstitutionInjuryStats(
    initialSubstitutionInjuryStats,
    startDate,
    endDate
  );

  const processedSubstitutionTacticalStatsData =
    processSubstitutionTacticalStats(
      initialSubstitutionOutTacticalStats,
      startDate,
      endDate
    );

  const processedSubstitutionInTacticalStatsData =
    processSubstitutionInTacticalStats(
      initialSubstitutionInTacticalStats,
      startDate,
      endDate
    );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <DateFilter
          onFilter={(startDate, endDate) => {
            setValue('startDate', startDate);
            setValue('endDate', endDate);
          }}
        />
        <MatchStats playerStats={processedPlayerStatsData} />
        <TableDisplay
          opponentStatsWithAverages={opponentStatsWithAverages}
          processedGoalStatsData={processedGoalStatsData}
          processedAssistStatsData={processedAssistStatsData}
          processedSubstitutionStatsData={processedSubstitutionStatsData}
          processedSubstitutionInjuryStatsData={
            processedSubstitutionInjuryStatsData
          }
          processedSubstitutionTacticalStatsData={
            processedSubstitutionTacticalStatsData
          }
          processedSubstitutionInTacticalStatsData={
            processedSubstitutionInTacticalStatsData
          }
        />
        <MatchOpponents matchData={filteredMatches} />
      </div>
    </FormProvider>
  );
};

export default FilteredMatchStatsPage;
