import React from 'react';

import { fetchMyStatsData } from '@/app/my-stats/fetchMyStatsData';
import MyStatsWrapper from '@/app/my-stats/MyStatsWrapper';
import ProtectedLayout from '@/app/ProtectedLayout';

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
