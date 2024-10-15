'use server';

import { getTrainingAttendanceFromDB } from '@/lib/services/getTrainingAttendanceService';
import { mapTrainingAttendance } from '@/utils/mapTrainingAttendanceUtility';
import { formatError } from '@/utils/errorUtils';
import { GetTrainingAttendanceListResponse } from '@/types/type-list';

export async function getTrainingAttendanceList(): Promise<GetTrainingAttendanceListResponse> {
  try {
    const players = await getTrainingAttendanceFromDB();
    const attendanceList = mapTrainingAttendance(players);

    return { success: true, attendanceList };
  } catch (error) {
    const formattedError = formatError('Failed to fetch attendance data.', [
      'getTrainingAttendanceList',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
