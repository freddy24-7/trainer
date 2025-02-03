'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilteredMatchStatsPage from '@/components/helpers/matchStatsHelpers/FilteredMatchStatsPage';
import { MatchStatsWrapperProps } from '@/types/stats-types';

const MatchStatsWrapper: React.FC<MatchStatsWrapperProps> = ({
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

  return (
    <FormProvider {...methods}>
      <FilteredMatchStatsPage
        initialPlayerStats={initialPlayerStats}
        initialMatchData={initialMatchData}
        initialOpponentStats={initialOpponentStats}
        initialGoalStats={initialGoalStats}
        initialAssistStats={initialAssistStats}
        initialSubstitutionStats={initialSubstitutionStats}
        initialSubstitutionInjuryStats={initialSubstitutionInjuryStats}
        initialSubstitutionOutTacticalStats={
          initialSubstitutionOutTacticalStats
        }
        initialSubstitutionInTacticalStats={initialSubstitutionInTacticalStats}
      />
    </FormProvider>
  );
};

export default MatchStatsWrapper;
