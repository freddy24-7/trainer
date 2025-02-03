import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { PlayerStat } from '@/types/user-types';

export function handleFilterDataByDate<T extends { date: string | Date }>(
  data: T[],
  startDate: string | Date | null,
  endDate: string | Date | null
): T[] {
  if (!startDate || !endDate) return data;

  const start = new Date(startDate);
  const end = new Date(endDate);
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });
}

export function handleFilterAttendanceList(
  attendanceList: PlayerAttendance[],
  trainingData: TrainingData[]
): PlayerAttendance[] {
  return attendanceList.filter((attendance) =>
    trainingData.some((session) => session.id === attendance.playerId)
  );
}

export function getCalculatedUserMatchStats({
  playerStats,
  userId,
  startDate,
  endDate,
  totalMatches,
}: {
  playerStats: PlayerStat[];
  userId: number | string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  totalMatches: number;
}): { matchesPlayed: number; avgMinutesPlayed: number } {
  const userStat = playerStats.find(
    (stat) => stat.id.toString() === userId.toString()
  );
  if (!userStat) {
    return { matchesPlayed: 0, avgMinutesPlayed: 0 };
  }

  const filteredUserMatchData = (userStat.matchData ?? []).filter((entry) => {
    if (startDate && endDate) {
      const matchDate = new Date(entry.match.date);
      return matchDate >= new Date(startDate) && matchDate <= new Date(endDate);
    }
    return true;
  });

  const absences = filteredUserMatchData.filter(
    (entry) => !entry.available
  ).length;

  const matchesPlayed = totalMatches - absences;

  const totalMinutes = filteredUserMatchData
    .filter((entry) => entry.available)
    .reduce((sum, entry) => sum + entry.minutes, 0);

  const avgMinutesPlayed = matchesPlayed > 0 ? totalMinutes / matchesPlayed : 0;

  return { matchesPlayed, avgMinutesPlayed };
}

export function getCalculatedTrainingStats(
  trainingData: TrainingData[],
  attendanceList: PlayerAttendance[],
  userId: number | string
): { totalTrainings: number; attendedTrainings: number } {
  const totalTrainings = trainingData.length;
  const attendedTrainings = attendanceList.filter(
    (attendance) => attendance.playerId.toString() === userId.toString()
  ).length;
  return { totalTrainings, attendedTrainings };
}
