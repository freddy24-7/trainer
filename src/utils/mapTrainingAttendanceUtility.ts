import { PlayerAttendance, PlayerAbsence } from '@/types/training-types';

export function handleMapTrainingAttendance(
  players: PlayerAbsence[]
): PlayerAttendance[] {
  return players.map((player) => ({
    playerId: player.id,
    username: player.username ?? 'Unknown Player',
    absences: player.trainingPlayers.length,
  }));
}
