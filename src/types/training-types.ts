import { CalendarDate } from '@internationalized/date';
import React from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

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

export interface TrainingFormBodyProps {
  players: TrainingPlayersFieldProps['players'];
  playerValues: TrainingPlayersFieldProps['playerValues'];
  setValue: TrainingPlayersFieldProps['setValue'];
  errors: FieldErrors<TrainingFormValues>;
  date: TrainingFormValues['date'];
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export interface TrainingAbsence {
  id: number;
  date: Date;
  formattedDate: string;
  absences: string;
}

export interface TrainingAbsenceTableProps {
  absenceData: TrainingAbsence[];
}

export interface PlayerTrainingStat {
  id: number;
  username: string;
  totalMissed: number;
}

export interface TrainingStatsTableProps {
  trainingStats: PlayerTrainingStat[];
}

interface TrainingStatsPlayer {
  id: number;
  username: string | null;
  absent: boolean;
}

interface TrainingStatsData {
  id: number;
  date: Date;
  players: TrainingStatsPlayer[];
}

export interface TrainingStatsWrapperProps {
  initialTrainingData: TrainingStatsData[];
}

export interface TrainingProps {
  id: number;
  date: Date;
  trainingPlayers: TrainingPlayer[];
}
