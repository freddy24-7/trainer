import React from 'react';

import ProtectedLayout from '@/app/ProtectedLayout';
import { fetchMyStatsData } from '@/components/helpers/statsHelpers/fetchMyStatsData';
import MyStatsWrapper from '@/components/helpers/statsHelpers/MyStatsWrapper';

const MyStatsPage = async (): Promise<React.ReactElement> => {
  const response = await fetchMyStatsData();

  if (!response.success) {
    return (
      <ProtectedLayout requiredRole="PLAYER">
        <div className="p-6 bg-red-100 text-red-800">{response.error}</div>
      </ProtectedLayout>
    );
  }

  const { user, trainingData, attendanceList, playerStats } = response.data;

  return (
    <ProtectedLayout requiredRole="PLAYER">
      <MyStatsWrapper
        user={user}
        initialTrainingData={trainingData}
        initialAttendanceList={attendanceList}
        initialPlayerStats={playerStats}
      />
    </ProtectedLayout>
  );
};

export default MyStatsPage;
