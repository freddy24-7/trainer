import { CalendarDate } from '@nextui-org/react';
import { UseFormSetValue } from 'react-hook-form';
import { Player } from './user-types';

export interface TrainingAttendanceClientProps {
  attendanceList: PlayerAttendance[];
}

export interface TrainingData {
  id: number;
  date: string;
  absentPlayers: string[];
}

export interface TrainingFormValues {
  date: CalendarDate | null;
  players: { userId: number; absent: boolean }[];
}

export interface TrainingPlayer {
  user: {
    username: string | null;
  };
}

export interface TrainingPlayersFieldProps {
  players: Player[];
  playerValues: { userId: number; absent: boolean }[];
  setValue: UseFormSetValue<TrainingFormValues>;
}

export interface TrainingProps {
  id: number;
  date: Date;
  trainingPlayers: TrainingPlayer[];
}

export interface TrainingSessionsListProps {
  trainingData: TrainingData[];
}

export interface TrainingClientProps {
  trainingData: TrainingData[];
}

export interface AbsentTrainingPlayer {
  absent: boolean;
}

export interface PlayerAbsence {
  id: number;
  username: string | null;
  TrainingPlayer: AbsentTrainingPlayer[];
}

export interface PlayerAttendance {
  playerId: number;
  username: string;
  absences: number;
}

export interface PlayerAttendanceTableProps {
  attendanceList: PlayerAttendance[];
}
