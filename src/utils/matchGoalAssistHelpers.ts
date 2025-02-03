import {
  GoalsByPlayerStatData,
  AssistsByPlayerStatData,
  ProcessedGoalStat,
  ProcessedAssistStat,
} from '@/types/stats-types';

export const processGoalStats = (
  initialGoalStats: GoalsByPlayerStatData[],
  startDate?: string,
  endDate?: string
): ProcessedGoalStat[] => {
  return initialGoalStats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = match.date ? new Date(match.date) : null;
      return matchDate && startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });

    return {
      id: player.id,
      username: player.username,
      goalsAgainstStronger: filteredMatchData
        .filter((m) => m.opponentStrength === 'STRONGER')
        .reduce((sum, match) => sum + match.goals, 0),
      goalsAgainstSimilar: filteredMatchData
        .filter((m) => m.opponentStrength === 'SIMILAR')
        .reduce((sum, match) => sum + match.goals, 0),
      goalsAgainstWeaker: filteredMatchData
        .filter((m) => m.opponentStrength === 'WEAKER')
        .reduce((sum, match) => sum + match.goals, 0),
      totalGoals: filteredMatchData.reduce(
        (sum, match) => sum + match.goals,
        0
      ),
    };
  });
};

export const processAssistStats = (
  initialAssistStats: AssistsByPlayerStatData[],
  startDate?: string,
  endDate?: string
): ProcessedAssistStat[] => {
  return initialAssistStats.map((player) => {
    const filteredMatchData = player.matchData.filter((match) => {
      const matchDate = match.date ? new Date(match.date) : null;
      return matchDate && startDate && endDate
        ? matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        : true;
    });

    return {
      id: player.id,
      username: player.username,
      assistsAgainstStronger: filteredMatchData
        .filter((m) => m.opponentStrength === 'STRONGER')
        .reduce((sum, match) => sum + match.assists, 0),
      assistsAgainstSimilar: filteredMatchData
        .filter((m) => m.opponentStrength === 'SIMILAR')
        .reduce((sum, match) => sum + match.assists, 0),
      assistsAgainstWeaker: filteredMatchData
        .filter((m) => m.opponentStrength === 'WEAKER')
        .reduce((sum, match) => sum + match.assists, 0),
      totalAssists: filteredMatchData.reduce(
        (sum, match) => sum + match.assists,
        0
      ),
    };
  });
};
