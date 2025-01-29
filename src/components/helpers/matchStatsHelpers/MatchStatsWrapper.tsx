'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilteredMatchStatsPage from '@/components/helpers/matchStatsHelpers/FilteredMatchStatsPage';
import { MatchData, PlayerOpponentStatData } from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface MatchStatsWrapperProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStatData[];
}

const MatchStatsWrapper: React.FC<MatchStatsWrapperProps> = ({
  initialPlayerStats,
  initialMatchData,
  initialOpponentStats,
}) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FilteredMatchStatsPage
        initialPlayerStats={initialPlayerStats}
        initialMatchData={initialMatchData}
        initialOpponentStats={initialOpponentStats}
      />
    </FormProvider>
  );
};

export default MatchStatsWrapper;
