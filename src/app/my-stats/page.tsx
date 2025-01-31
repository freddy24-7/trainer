import React from 'react';

import { getMatchData } from '@/app/actions/getMatchData';
import { getMyStatsData } from '@/app/actions/getMyStatsData';
import ProtectedLayout from '@/app/ProtectedLayout';
import MyStatsWrapper from '@/components/helpers/myStatsHelpers/MyStatsWrapper';

const MyStatsPage = async (): Promise<React.ReactElement> => {
  const response = await getMyStatsData();
  const matchResponse = await getMatchData();

  if (!response.success) {
    return (
      <ProtectedLayout requiredRole="PLAYER">
        <div className="p-6 bg-red-100 text-red-800">{response.error}</div>
      </ProtectedLayout>
    );
  }

  if (!matchResponse.success) {
    console.error('Error fetching match data:', matchResponse.error);
  }

  const { user, trainingData, attendanceList, playerStats } = response.data;
  const matchData = matchResponse.success ? matchResponse.matchData : [];

  return (
    <ProtectedLayout requiredRole="PLAYER">
      <MyStatsWrapper
        user={user}
        initialTrainingData={trainingData}
        initialAttendanceList={attendanceList}
        initialPlayerStats={playerStats}
        initialMatchData={matchData}
      />
    </ProtectedLayout>
  );
};

export default MyStatsPage;
