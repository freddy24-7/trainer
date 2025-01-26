'use client';

import React, { useState } from 'react';

import MatchOpponents from '@/components/helpers/statsHelpers/MatchOpponents';
import MatchStats from '@/components/helpers/statsHelpers/MatchStats';
import DateFilter from '@/components/DateFilter';
import { MatchData } from '@/types/match-types';
import { PlayerMatchStat } from '@/types/user-types';

interface FilteredMatchStatsPageProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
}

const FilteredMatchStatsPage: React.FC<FilteredMatchStatsPageProps> = ({
  initialPlayerStats,
  initialMatchData,
}) => {
  const [filteredPlayerStats, setFilteredPlayerStats] =
    useState<PlayerMatchStat[]>(initialPlayerStats);
  const [filteredMatchData, setFilteredMatchData] =
    useState<MatchData[]>(initialMatchData);

  const handleFilter = (startDate: Date | null, endDate: Date | null): void => {
    if (!startDate || !endDate) return;

    const filteredMatches = initialMatchData.filter((match) => {
      const matchDate = new Date(match.date);
      return matchDate >= startDate && matchDate <= endDate;
    });

    const filteredStats = initialPlayerStats.filter((player) => {
      return player.matchesPlayed > 0;
    });

    setFilteredMatchData(filteredMatches);
    setFilteredPlayerStats(filteredStats);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <DateFilter onFilter={handleFilter} />
      <MatchStats playerStats={filteredPlayerStats} />
      <MatchOpponents matchData={filteredMatchData} />
    </div>
  );
};

export default FilteredMatchStatsPage;
