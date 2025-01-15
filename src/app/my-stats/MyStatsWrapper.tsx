'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchStatsTable from '@/components/helpers/MyMatchStatsTable';
import { TrainingData, PlayerAttendance } from '@/types/training-types';
import { PlayerStat, SignedInUser } from '@/types/user-types';
import {
  calculateTrainingStats,
  calculateMatchStats,
} from '@/utils/myStatsUtils';

interface MyStatsWrapperProps {
  user: SignedInUser;
  initialTrainingData: TrainingData[];
  initialAttendanceList: PlayerAttendance[];
  initialPlayerStats: PlayerStat[];
}

const MyStatsWrapper: React.FC<MyStatsWrapperProps> = ({
  user,
  initialTrainingData,
  initialAttendanceList,
  initialPlayerStats,
}) => {
  const methods = useForm();

  const [filteredTrainingData, setFilteredTrainingData] =
    useState<TrainingData[]>(initialTrainingData);
  const [filteredAttendanceList, setFilteredAttendanceList] = useState<
    PlayerAttendance[]
  >(initialAttendanceList);
  const [filteredPlayerStats, setFilteredPlayerStats] =
    useState<PlayerStat[]>(initialPlayerStats);

  const handleFilter = (startDate: Date | null, endDate: Date | null): void => {
    if (!startDate || !endDate) return;

    const filteredTrainings = initialTrainingData.filter((training) => {
      const trainingDate = new Date(training.date);
      return trainingDate >= startDate && trainingDate <= endDate;
    });

    const filteredAttendance = initialAttendanceList.filter((attendance) =>
      filteredTrainings.some((session) => session.id === attendance.playerId)
    );

    const filteredStats = initialPlayerStats;

    setFilteredTrainingData(filteredTrainings);
    setFilteredAttendanceList(filteredAttendance);
    setFilteredPlayerStats(filteredStats);
  };

  const { totalTrainings, attendedTrainings } = calculateTrainingStats(
    filteredTrainingData,
    filteredAttendanceList,
    user.id
  );

  const { totalMatches, matchesPlayed, avgMinutesPlayed } = calculateMatchStats(
    filteredPlayerStats,
    user.id
  );

  return (
    <FormProvider {...methods}>
      <div className="p-6 max-w-3xl mx-auto">
        <DateFilter onFilter={handleFilter} />
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
    </FormProvider>
  );
};

export default MyStatsWrapper;
