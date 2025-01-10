import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { PlayerStat } from '@/types/user-types';

export const calculateTrainingStats = (
  trainingData: TrainingData[],
  attendanceList: PlayerAttendance[],
  userId: string
): { totalTrainings: number; attendedTrainings: number } => {
  const playerAttendance = attendanceList.find(
    (attendance) => attendance.playerId.toString() === userId
  );

  const totalTrainings = trainingData.length;
  const attendedTrainings =
    totalTrainings - (playerAttendance?.absences ?? totalTrainings);

  return { totalTrainings, attendedTrainings };
};

export const calculateMatchStats = (
  playerStats: PlayerStat[],
  userId: string
): {
  totalMatches: number;
  matchesPlayed: number;
  avgMinutesPlayed: number;
} => {
  const playerMatchStats = playerStats.find(
    (stats) => stats.id.toString() === userId
  );

  const totalMatches = playerStats.reduce(
    (acc, stats) => acc + stats.matchesPlayed,
    0
  );
  const matchesPlayed = playerMatchStats?.matchesPlayed ?? 0;
  const avgMinutesPlayed = playerMatchStats?.averagePlayingTime ?? 0;

  return { totalMatches, matchesPlayed, avgMinutesPlayed };
};
