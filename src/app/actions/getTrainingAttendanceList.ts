'use server';

import prisma from '@/lib/prisma';
import {
  GetTrainingAttendanceListResponse,
  PlayerAttendance,
} from '@/types/types';

export async function getTrainingAttendanceList(): Promise<GetTrainingAttendanceListResponse> {
  try {
    const players = await prisma.user.findMany({
      where: {
        role: 'PLAYER',
      },
      include: {
        TrainingPlayer: {
          where: { absent: true },
        },
      },
    });

    const attendanceList: PlayerAttendance[] = players.map((player) => ({
      playerId: player.id,
      username: player.username ?? 'Unknown Player',
      absences: player.TrainingPlayer.length,
    }));

    return { success: true, attendanceList };
  } catch {
    return { success: false, error: 'Failed to fetch attendance data.' };
  }
}
