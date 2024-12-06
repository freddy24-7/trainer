'use server';

import { getTrainingAttendanceFromDB } from '@/lib/services/getTrainingAttendanceService';
import { errorFetchingAttendanceData } from '@/strings/actionStrings';
import { GetTrainingAttendanceListResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapTrainingAttendance } from '@/utils/mapTrainingAttendanceUtility';

export async function getTrainingAttendanceList(): Promise<GetTrainingAttendanceListResponse> {
  try {
    const players = await getTrainingAttendanceFromDB();
    const attendanceList = handleMapTrainingAttendance(players);

    return { success: true, attendanceList };
  } catch (error) {
    console.error(errorFetchingAttendanceData, error);
    const formattedError = formatError(errorFetchingAttendanceData, [
      'getTrainingAttendanceList',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
