import { MatchData } from '@/types/match-types';
import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { PlayerStat } from '@/types/user-types';

export const calculateTrainingStats = (
  trainingData: TrainingData[],
  attendanceList: PlayerAttendance[],
  userId: string
): { totalTrainings: number; attendedTrainings: number } => {
  if (!Array.isArray(trainingData)) {
    console.error('trainingData is not an array:', trainingData);
    return { totalTrainings: 0, attendedTrainings: 0 };
  }

  if (!Array.isArray(attendanceList)) {
    console.error('attendanceList is not an array:', attendanceList);
    return { totalTrainings: 0, attendedTrainings: 0 };
  }

  const playerAttendance = attendanceList.find(
    (attendance) => attendance.playerId.toString() === userId
  );

  const totalTrainings = trainingData.length;
  const attendedTrainings =
    totalTrainings - (playerAttendance?.absences ?? totalTrainings);

  return { totalTrainings, attendedTrainings };
};

export const calculateMatchStats = (
  matchData: MatchData[] = [],
  playerStats: PlayerStat[] = [],
  userId: string
): {
  matchesPlayed: number;
  avgMinutesPlayed: number;
} => {
  if (!Array.isArray(matchData)) {
    console.error('matchData is not an array or is undefined:', matchData);
  }

  if (!Array.isArray(playerStats)) {
    console.error('playerStats is not an array:', playerStats);
    playerStats = [];
  }

  const playerMatchStats = playerStats.find(
    (stats) => stats.id.toString() === userId
  );

  return {
    matchesPlayed: playerMatchStats?.matchesPlayed ?? 0,
    avgMinutesPlayed: playerMatchStats?.averagePlayingTime ?? 0,
  };
};
