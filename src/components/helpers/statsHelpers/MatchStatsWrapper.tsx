'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilteredMatchStatsPage from '@/components/helpers/statsHelpers/FilteredMatchStatsPage';
import { MatchData } from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface MatchStatsWrapperProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
}

const MatchStatsWrapper: React.FC<MatchStatsWrapperProps> = ({
  initialPlayerStats,
  initialMatchData,
}) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FilteredMatchStatsPage
        initialPlayerStats={initialPlayerStats}
        initialMatchData={initialMatchData}
      />
    </FormProvider>
  );
};

export default MatchStatsWrapper;
