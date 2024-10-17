import {
  TrainingData,
  TrainingPlayer,
  TrainingProps,
} from '@/types/training-types';

export function mapTrainingData(trainings: TrainingProps[]): TrainingData[] {
  return trainings.map((training) => ({
    id: training.id,
    date: training.date.toISOString(),
    absentPlayers: training.trainingPlayers.map(
      (tp: TrainingPlayer) => tp.user.username ?? 'Unknown Player'
    ),
  }));
}
