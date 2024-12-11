import React from 'react';

import { getTrainingAttendanceList } from '@/app/actions/getTrainingAttendanceList';
import { getTrainingData } from '@/app/actions/getTrainingData';
import ProtectedLayout from '@/app/ProtectedLayout';
import AttendanceTraining from '@/app/training-stats/AttendanceTraining';
import DataTrainingClient from '@/app/training-stats/DataTrainingClient';
import {
  errorLoadingTrainingData,
  errorLoadingAttendanceData,
} from '@/strings/serverStrings';
import { formatError } from '@/utils/errorUtils';

export default async function TrainingsPage(): Promise<React.ReactElement> {
  const [trainingDataResponse, attendanceDataResponse] = await Promise.all([
    getTrainingData(),
    getTrainingAttendanceList(),
  ]);

  if (!trainingDataResponse.success) {
    const formattedError = formatError(
      trainingDataResponse.error || errorLoadingTrainingData,
      ['getTrainingData']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }

  if (!attendanceDataResponse.success) {
    const formattedError = formatError(
      attendanceDataResponse.error || errorLoadingAttendanceData,
      ['getTrainingAttendanceList']
    );
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          {formattedError.errors[0].message}
        </div>
      </ProtectedLayout>
    );
  }

  const { trainingData } = trainingDataResponse;
  const { attendanceList } = attendanceDataResponse;

  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Training Sessions
        </h1>
        <DataTrainingClient trainingData={trainingData} />
        <h2 className="text-xl font-semibold text-center mt-6 mb-4">
          Player Attendance
        </h2>
        <AttendanceTraining attendanceList={attendanceList} />
      </div>
    </ProtectedLayout>
  );
}
