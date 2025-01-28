'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FilteredMatchStatsPage from '@/components/helpers/matchStatsHelpers/FilteredMatchStatsPage';
import { MatchData } from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

interface MatchStatsWrapperProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStat[];
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
