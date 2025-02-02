import { CalendarDate } from '@internationalized/date';
import { UseFormSetValue } from 'react-hook-form';

import { formatError } from '@/utils/errorUtils';

import { Player } from './user-types';

export interface TrainingData {
  id: number;
  date: string;
  absentPlayers: string[];
}

export interface TrainingFormValues {
  date: CalendarDate | null;
  players: { userId: number; absent: boolean }[];
}

export interface TrainingFormData {
  date: string | null;
  players: { userId: number; absent: boolean }[];
}

export interface TrainingPlayer {
  user: {
    username: string | null;
  };
  absent?: boolean;
}

export interface TrainingPlayerAttendance extends TrainingPlayer {
  absent: boolean;
}

export interface Training {
  id: number;
  date: Date;
  trainingPlayers: TrainingPlayer[];
}

export interface TrainingPlayersFieldProps {
  players: Player[];
  playerValues: { userId: number; absent: boolean }[];
  setValue: UseFormSetValue<TrainingFormValues>;
}

export interface AbsentTrainingPlayer {
  absent: boolean;
}

export interface PlayerAbsence {
  id: number;
  username: string | null;
  trainingPlayers: AbsentTrainingPlayer[];
}

export interface PlayerAttendance {
  playerId: number;
  username: string;
  absences: number;
}

export interface AddTrainingSuccess {
  success: true;
  training: unknown;
}

export type AddTrainingFailure = ReturnType<typeof formatError>;

export interface ActionResponse {
  success?: boolean;
  errors?: { message: string }[];
}

export interface TrainingFrontEndProps {
  action: (params: FormData) => Promise<ActionResponse>;
  players: Player[];
}

export interface ErrorDetails {
  message: string;
}

export interface TrainingDataPlayer {
  id: number;
  username: string;
  absent: boolean;
}

export interface TrainingDataResponse {
  id: number;
  date: Date;
  players: TrainingDataPlayer[];
}
