import { getPlayerStats } from '@/app/actions/getMyPlayerStats';
import { getTrainingAttendanceList } from '@/app/actions/getTrainingAttendanceList';
import { getTrainingData } from '@/app/actions/getTrainingData';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import {
  errorLoadingTrainingData,
  errorLoadingAttendanceData,
  errorLoadingPlayerStatistics,
} from '@/strings/serverStrings';
import { FetchMyStatsResult } from '@/types/myStats-types';
import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { PlayerStat } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export const fetchMyStatsData = async (): Promise<FetchMyStatsResult> => {
  const user = await fetchAndCheckUser();

  if (!user) {
    return {
      success: false,
      error: 'Unable to fetch user information.',
    };
  }

  const [trainingDataResponse, attendanceDataResponse, playerStatsResponse] =
    await Promise.all([
      getTrainingData(),
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
