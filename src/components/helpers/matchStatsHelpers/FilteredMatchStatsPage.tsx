'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchOpponents from '@/components/helpers/matchStatsHelpers/MatchOpponents';
import MatchStats from '@/components/helpers/matchStatsHelpers/MatchStats';
import PlayerOpponentStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOpponentStatsTable';
import { MatchData } from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

interface FilteredMatchStatsPageProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStat[];
}

const FilteredMatchStatsPage: React.FC<FilteredMatchStatsPageProps> = ({
  initialPlayerStats,
  initialMatchData,
  initialOpponentStats,
}) => {
  const methods = useForm();
  const { watch, setValue } = methods;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const filteredMatches = initialMatchData.filter((match) => {
    const matchDate = new Date(match.date);
    return startDate && endDate
      ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
      : true;
  });

  const filteredPlayerStats = initialPlayerStats.filter(
    (playerStat) => playerStat.matchesPlayed > 0
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
        <MatchStats playerStats={filteredPlayerStats} />
        <MatchOpponents matchData={filteredMatches} />
        <div className="mt-8 w-full max-w-4xl">
          <PlayerOpponentStatsTable playerStats={initialOpponentStats} />
        </div>
      </div>
    </FormProvider>
  );
};

export default FilteredMatchStatsPage;
