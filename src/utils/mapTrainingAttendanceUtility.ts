import { unknownPlayerMessage } from '@/strings/validationStrings';
import { PlayerAttendance, PlayerAbsence } from '@/types/training-types';

export function handleMapTrainingAttendance(
  players: PlayerAbsence[]
): PlayerAttendance[] {
  return players.map((player) => ({
    playerId: player.id,
    username: player.username ?? unknownPlayerMessage,
    absences: player.trainingPlayers.length,
  }));
}
