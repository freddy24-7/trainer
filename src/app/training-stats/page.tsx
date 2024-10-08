import React from 'react';

import { getTrainingAttendanceList } from '@/app/actions/getTrainingAttendanceList';
import { getTrainingData } from '@/app/actions/getTrainingData';
import ProtectedLayout from '@/app/protected-layout';
import TrainingAttendanceClient from '@/components/trainings/TrainingAttendanceClient';
import TrainingClient from '@/components/trainings/TrainingClient';

export default async function TrainingsPage(): Promise<React.ReactElement> {
  const [trainingDataResponse, attendanceDataResponse] = await Promise.all([
    getTrainingData(),
    getTrainingAttendanceList(),
  ]);

  if (!trainingDataResponse.success) {
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          Error loading training data: {trainingDataResponse.error}
        </div>
      </ProtectedLayout>
    );
  }

  if (!attendanceDataResponse.success) {
    return (
      <ProtectedLayout requiredRole="TRAINER">
        <div className="p-6 bg-red-100 text-red-800">
          Error loading attendance data: {attendanceDataResponse.error}
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
        <TrainingClient trainingData={trainingData} />
        <h2 className="text-xl font-semibold text-center mt-6 mb-4">
          Player Attendance
        </h2>
        <TrainingAttendanceClient attendanceList={attendanceList} />
      </div>
    </ProtectedLayout>
  );
}
