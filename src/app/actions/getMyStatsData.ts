import { getPlayerStats } from '@/app/actions/getMyPlayerStats';
import { getMyTrainingData } from '@/app/actions/getMyTrainingData';
import { getTrainingAttendanceList } from '@/app/actions/getTrainingAttendanceList';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import {
  errorLoadingTrainingData,
  errorLoadingAttendanceData,
  errorLoadingPlayerStatistics,
} from '@/strings/serverStrings';
import { FetchMyStatsResult } from '@/types/myStats-types';
import { PlayerStat } from '@/types/stats-types';
import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { formatError } from '@/utils/errorUtils';

export const getMyStatsData = async (): Promise<FetchMyStatsResult> => {
  const user = await fetchAndCheckUser();

  if (!user) {
    return {
      success: false,
      error: 'Unable to fetch user information.',
    };
  }

  const [trainingDataResponse, attendanceDataResponse, playerStatsResponse] =
    await Promise.all([
      getMyTrainingData(),
      getTrainingAttendanceList(),
      getPlayerStats(),
    ]);

  if (!trainingDataResponse.success) {
    return {
      success: false,
      error: formatError(
        trainingDataResponse.error || errorLoadingTrainingData,
        ['getTrainingData']
      ).errors[0].message,
    };
  }

  if (!attendanceDataResponse.success) {
    return {
      success: false,
      error: formatError(
        attendanceDataResponse.error || errorLoadingAttendanceData,
        ['getTrainingAttendanceList']
      ).errors[0].message,
    };
  }

  if (!playerStatsResponse.success) {
    return {
      success: false,
      error: formatError(
        playerStatsResponse.error || errorLoadingPlayerStatistics,
        ['getPlayerStats']
      ).errors[0].message,
    };
  }

  return {
    success: true,
    data: {
      user,
      trainingData: trainingDataResponse.trainingData as TrainingData[],
      attendanceList:
        attendanceDataResponse.attendanceList as PlayerAttendance[],
      playerStats: playerStatsResponse.playerStats as PlayerStat[],
    },
  };
};
