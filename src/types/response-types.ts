import { ZodIssue } from 'zod';

import { MatchData } from './match-types';
import { Poule } from './poule-types';
import { PlayerAttendance, TrainingData } from './training-types';

export type GetMatchDataResponse =
  | { success: true; matchData: MatchData[] }
  | { success: false; error: string };

export type GetTeamsInPouleResponse =
  | GetTeamsInPouleSuccess
  | GetTeamsInPouleError;

export type GetTrainingAttendanceListResponse =
  | { success: true; attendanceList: PlayerAttendance[] }
  | { success: false; error: string };

export type GetTrainingDataResponse =
  | { success: true; trainingData: TrainingData[] }
  | { success: false; error: string };

export interface GetTeamsInPouleError {
  success: false;
  errors: ZodIssue[];
}

export interface GetTeamsInPouleSuccess {
  success: true;
  poules: Poule[];
  latestPoule: Poule;
}
