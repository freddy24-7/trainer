import {
  MatchData,
  PlayerDataAdd,
  PlayerOpponentStatData,
  PlayerOpponentStat,
  SubstitutionOutStatData,
  ProcessedPlayerStat,
  ProcessedSubstitutionStat,
} from '@/types/match-types';

export const filterMatchesByDate = (
  matches: MatchData[],
  startDate?: string,
  endDate?: string
): MatchData[] => {
  if (!startDate || !endDate) return matches;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return matches.filter((match) => {
    const matchDate = new Date(match.date);
    return matchDate >= start && matchDate <= end;
  });
};

export const calculateOpponentStats = (
  initialOpponentStats: PlayerOpponentStatData[],
  startDate?: string,
  endDate?: string
): PlayerOpponentStat[] => {
  return initialOpponentStats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = new Date(match.date);
      return startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });

    const totalMinutes = filteredMatchData.reduce(
      (sum, match) => sum + match.minutes,
      0
    );
    const avgMinutes =
      filteredMatchData.length > 0
        ? totalMinutes / filteredMatchData.length
        : 0;

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
      avgMinutes,
      avgMinutesStronger:
        strongerMatches > 0 ? totalStrongerMinutes / strongerMatches : 0,
      avgMinutesSimilar:
        similarMatches > 0 ? totalSimilarMinutes / similarMatches : 0,
      avgMinutesWeaker:
        weakerMatches > 0 ? totalWeakerMinutes / weakerMatches : 0,
    };
  });
};

export const processPlayerStats = (
  initialPlayerStats: PlayerDataAdd[],
  startDate?: string,
  endDate?: string
): ProcessedPlayerStat[] => {
  return initialPlayerStats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = match.date ? new Date(match.date) : null;
      return matchDate && startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });

    const absences = filteredMatchData.filter(
      (match) => !match.available
    ).length;
    const matchesPlayed = filteredMatchData.length - absences;
    const totalMinutes = filteredMatchData.reduce(
      (sum, match) => sum + match.minutes,
      0
    );

    return {
      id: player.id,
      username: player.username,
      matchesPlayed: matchesPlayed >= 0 ? matchesPlayed : 0,
      averagePlayingTime: matchesPlayed > 0 ? totalMinutes / matchesPlayed : 0,
      absences,
      goals: filteredMatchData.reduce((sum, match) => sum + match.goals, 0),
      assists: filteredMatchData.reduce((sum, match) => sum + match.assists, 0),
    };
  });
};

const processSubstitutionData = (
  stats: SubstitutionOutStatData[],
  startDate?: string,
  endDate?: string
): ProcessedSubstitutionStat[] => {
  return stats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = match.date ? new Date(match.date) : null;
      return matchDate && startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });
    return {
      id: player.id,
      username: player.username,
      substitutionsAgainstStronger: filteredMatchData.filter(
        (m) => m.opponentStrength === 'STRONGER'
      ).length,
      substitutionsAgainstSimilar: filteredMatchData.filter(
        (m) => m.opponentStrength === 'SIMILAR'
      ).length,
      substitutionsAgainstWeaker: filteredMatchData.filter(
        (m) => m.opponentStrength === 'WEAKER'
      ).length,
      totalSubstitutions: filteredMatchData.length,
    };
  });
};

export const processSubstitutionStats = (
  initialSubstitutionStats: SubstitutionOutStatData[],
  startDate?: string,
  endDate?: string
): ProcessedSubstitutionStat[] => {
  return processSubstitutionData(initialSubstitutionStats, startDate, endDate);
};

export const processSubstitutionInjuryStats = (
  initialSubstitutionInjuryStats: SubstitutionOutStatData[],
  startDate?: string,
  endDate?: string
): ProcessedSubstitutionStat[] => {
  return processSubstitutionData(
    initialSubstitutionInjuryStats,
    startDate,
    endDate
  );
};

export const processSubstitutionTacticalStats = (
  initialSubstitutionOutTacticalStats: SubstitutionOutStatData[],
  startDate?: string,
  endDate?: string
): ProcessedSubstitutionStat[] => {
  return processSubstitutionData(
    initialSubstitutionOutTacticalStats,
    startDate,
    endDate
  );
};

export const processSubstitutionInTacticalStats = (
  initialSubstitutionInTacticalStats: SubstitutionOutStatData[],
  startDate?: string,
  endDate?: string
): ProcessedSubstitutionStat[] => {
  return processSubstitutionData(
    initialSubstitutionInTacticalStats,
    startDate,
    endDate
  );
};
