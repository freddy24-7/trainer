import { PlayerAttendance, PlayerAbsence } from '@/types/training-types';

export function mapTrainingAttendance(
  players: PlayerAbsence[]
): PlayerAttendance[] {
  return players.map((player) => ({
    playerId: player.id,
    username: player.username ?? 'Unknown Player',
    absences: player.TrainingPlayer.length,
  }));
}
