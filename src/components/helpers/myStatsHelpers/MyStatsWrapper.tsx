'use client';

import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchStatsTable from '@/components/helpers/myStatsHelpers/MyMatchStatsTable';
import {
  myStatsHeader,
  trainingStatsHeader,
  usernameLabel,
  totalTrainingsLabel,
  attendanceLabel,
  outOfLabel,
} from '@/strings/clientStrings';
import { MyStatsWrapperProps } from '@/types/stats-types';
import {
  getCalculatedTrainingStats,
  handleFilterDataByDate,
  handleFilterAttendanceList,
  getCalculatedUserMatchStats,
} from '@/utils/myStatsWrapperUtils';

const MyStatsWrapper: React.FC<MyStatsWrapperProps> = ({
  user,
  initialTrainingData,
  initialAttendanceList,
  initialPlayerStats,
  initialMatchData,
}) => {
  const methods = useForm();
  const { watch, setValue } = methods;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const filteredTrainingData = useMemo(
    () => handleFilterDataByDate(initialTrainingData, startDate, endDate),
    [initialTrainingData, startDate, endDate]
  );

  const filteredMatchData = useMemo(
    () => handleFilterDataByDate(initialMatchData, startDate, endDate),
    [initialMatchData, startDate, endDate]
  );

  const filteredAttendanceList = useMemo(
    () =>
      startDate && endDate
        ? handleFilterAttendanceList(
            initialAttendanceList,
            filteredTrainingData
          )
        : initialAttendanceList,
    [initialAttendanceList, filteredTrainingData, startDate, endDate]
  );

  const { totalTrainings, attendedTrainings } = getCalculatedTrainingStats(
    filteredTrainingData,
    filteredAttendanceList,
    user.id
  );

  const totalMatches = filteredMatchData.length;

  const { matchesPlayed, avgMinutesPlayed } = useMemo(
    () =>
      getCalculatedUserMatchStats({
        playerStats: initialPlayerStats,
        userId: user.id,
        startDate,
        endDate,
        totalMatches,
      }),
    [initialPlayerStats, user.id, startDate, endDate, totalMatches]
  );

  return (
    <FormProvider {...methods}>
      <div className="p-6 max-w-3xl mx-auto">
        <DateFilter
          onFilter={(startDate, endDate) => {
            setValue('startDate', startDate);
            setValue('endDate', endDate);
          }}
        />
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          {myStatsHeader}
        </h1>

        <div className="bg-white shadow-md rounded-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            {trainingStatsHeader}
          </h2>

          <p className="text-lg text-black">
            <strong>{usernameLabel}</strong> {user.username}
          </p>

          <p className="text-lg text-black">
            <strong>{totalTrainingsLabel}</strong> {totalTrainings}
          </p>

          <p className="text-lg text-black">
            <strong>{attendanceLabel}</strong> {attendedTrainings} {outOfLabel}{' '}
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
