'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchOpponents from '@/components/helpers/matchStatsHelpers/MatchOpponents';
import MatchStats from '@/components/helpers/matchStatsHelpers/MatchStats';
import PlayerOpponentStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOpponentStatsTable';
import {
  MatchData,
  PlayerOpponentStatData,
  PlayerOpponentStat,
} from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface FilteredMatchStatsPageProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStatData[];
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

  const opponentStatsWithAverages: PlayerOpponentStat[] =
    initialOpponentStats.map((player) => {
      const filteredMatchData = player.matchData.filter((match) => {
        const matchDate = new Date(match.date);
        return startDate && endDate
          ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
          : true;
      });

      const totalStrongerMinutes = filteredMatchData
        .filter((m) => m.opponentStrength === 'STRONGER')
        .reduce((sum, match) => sum + match.minutes, 0);
      const totalSimilarMinutes = filteredMatchData
        .filter((m) => m.opponentStrength === 'SIMILAR')
        .reduce((sum, match) => sum + match.minutes, 0);
      const totalWeakerMinutes = filteredMatchData
        .filter((m) => m.opponentStrength === 'WEAKER')
        .reduce((sum, match) => sum + match.minutes, 0);

      const strongerMatches = filteredMatchData.filter(
        (m) => m.opponentStrength === 'STRONGER'
      ).length;
      const similarMatches = filteredMatchData.filter(
        (m) => m.opponentStrength === 'SIMILAR'
      ).length;
      const weakerMatches = filteredMatchData.filter(
        (m) => m.opponentStrength === 'WEAKER'
      ).length;

      return {
        id: player.id,
        username: player.username,
        avgMinutesStronger:
          strongerMatches > 0 ? totalStrongerMinutes / strongerMatches : 0,
        avgMinutesSimilar:
          similarMatches > 0 ? totalSimilarMinutes / similarMatches : 0,
        avgMinutesWeaker:
          weakerMatches > 0 ? totalWeakerMinutes / weakerMatches : 0,
      };
    });

  const processedPlayerStats = initialPlayerStats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = match.date ? new Date(match.date) : null;
      return matchDate && startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });

    return {
      id: player.id,
      username: player.username,
      matchesPlayed: filteredMatchData.length,
      averagePlayingTime:
        filteredMatchData.length > 0
          ? filteredMatchData.reduce((sum, match) => sum + match.minutes, 0) /
            filteredMatchData.length
          : 0,
      absences: filteredMatchData.filter((match) => !match.available).length,
      goals: filteredMatchData.reduce((sum, match) => sum + match.goals, 0),
      assists: filteredMatchData.reduce((sum, match) => sum + match.assists, 0),
    };
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <DateFilter
          onFilter={(startDate, endDate) => {
            setValue('startDate', startDate);
            setValue('endDate', endDate);
          }}
        />
        <MatchStats playerStats={processedPlayerStats} />
        <MatchOpponents matchData={filteredMatches} />
        <div className="mt-8 w-full max-w-4xl">
          <PlayerOpponentStatsTable playerStats={opponentStatsWithAverages} />{' '}
        </div>
      </div>
    </FormProvider>
  );
};

export default FilteredMatchStatsPage;
