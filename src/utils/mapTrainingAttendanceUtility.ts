import { PlayerAttendance } from '@/types/type-list';

interface AbsentTrainingPlayer {
  absent: boolean;
}

interface PlayerAbsence {
  id: number;
  username: string | null;
  TrainingPlayer: AbsentTrainingPlayer[];
}

export function mapTrainingAttendance(
  players: PlayerAbsence[]
): PlayerAttendance[] {
  return players.map((player) => ({
    playerId: player.id,
    username: player.username ?? 'Unknown Player',
    absences: player.TrainingPlayer.length,
  }));
}
