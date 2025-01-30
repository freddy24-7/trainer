'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilteredMatchStatsPage from '@/components/helpers/matchStatsHelpers/FilteredMatchStatsPage';
import { MatchStatsWrapperProps } from '@/types/match-types';

const MatchStatsWrapper: React.FC<MatchStatsWrapperProps> = ({
  initialPlayerStats,
  initialMatchData,
  initialOpponentStats,
  initialGoalStats,
  initialAssistStats,
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
      />
    </FormProvider>
  );
};

export default MatchStatsWrapper;
