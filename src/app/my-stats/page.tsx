import React from 'react';

import ProtectedLayout from '@/app/ProtectedLayout';
import { fetchMyStatsData } from '@/app/my-stats/fetchMyStatsData';
import MatchStatsTable from '@/components/helpers/MyMatchStatsTable';
import {
  calculateTrainingStats,
  calculateMatchStats,
} from '@/utils/myStatsUtils';

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

  const { totalTrainings, attendedTrainings } = calculateTrainingStats(
    trainingData,
    attendanceList,
    user.id
  );

  const { totalMatches, matchesPlayed, avgMinutesPlayed } = calculateMatchStats(
    playerStats,
    user.id
  );

  return (
    <ProtectedLayout requiredRole="PLAYER">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          My Training and Match Stats
        </h1>
        <div className="bg-white shadow-md rounded-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Training Statistics
          </h2>
          <p className="text-lg text-black">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-lg text-black">
            <strong>Total Trainings:</strong> {totalTrainings}
          </p>
          <p className="text-lg text-black">
            <strong>Your Attendance:</strong> {attendedTrainings} out of{' '}
            {totalTrainings}
          </p>
        </div>

        <MatchStatsTable
          totalMatches={totalMatches}
          matchesPlayed={matchesPlayed}
          avgMinutesPlayed={avgMinutesPlayed}
        />
      </div>
    </ProtectedLayout>
  );
};

export default MyStatsPage;
