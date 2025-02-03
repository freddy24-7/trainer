import { PlayerStat } from '@/types/stats-types';
import { PlayerAttendance, TrainingData } from '@/types/training-types';
import { SignedInUser } from '@/types/user-types';

export interface FetchMyStatsSuccess {
  success: true;
  data: {
    user: SignedInUser;
    trainingData: TrainingData[];
    attendanceList: PlayerAttendance[];
    playerStats: PlayerStat[];
  };
}

export interface FetchMyStatsError {
  success: false;
  error: string;
}

export type FetchMyStatsResult = FetchMyStatsSuccess | FetchMyStatsError;
