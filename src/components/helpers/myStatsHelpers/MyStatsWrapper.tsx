'use client';

import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import MatchStatsTable from '@/components/helpers/myStatsHelpers/MyMatchStatsTable';
import { MyStatsWrapperProps } from '@/types/match-types';
import { calculateTrainingStats } from '@/utils/myStatsUtils';

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

  const filteredTrainingData = useMemo(() => {
    return startDate && endDate
      ? initialTrainingData.filter((training) => {
          const trainingDate = new Date(training.date);
          return (
            trainingDate >= new Date(startDate) &&
            trainingDate <= new Date(endDate)
          );
        })
      : initialTrainingData;
  }, [initialTrainingData, startDate, endDate]);

  const filteredAttendanceList = useMemo(() => {
    return startDate && endDate
      ? initialAttendanceList.filter((attendance) =>
          filteredTrainingData.some(
            (session) => session.id === attendance.playerId
          )
        )
      : initialAttendanceList;
  }, [initialAttendanceList, filteredTrainingData, startDate, endDate]);

  const filteredMatchData = useMemo(() => {
    return startDate && endDate
      ? initialMatchData.filter((match) => {
          const matchDate = new Date(match.date);
          return (
            matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
          );
        })
      : initialMatchData;
  }, [initialMatchData, startDate, endDate]);

  const { totalTrainings, attendedTrainings } = calculateTrainingStats(
    filteredTrainingData,
    filteredAttendanceList,
    user.id
  );

  const totalMatches = filteredMatchData.length;

  const { matchesPlayed, avgMinutesPlayed } = useMemo(() => {
    const userStat = initialPlayerStats.find(
      (stat) => stat.id.toString() === user.id.toString()
    );
    if (!userStat) {
      return { matchesPlayed: 0, avgMinutesPlayed: 0 };
    }

    const filteredUserMatchData = (userStat.matchData ?? []).filter((entry) => {
      if (startDate && endDate) {
        const matchDate = new Date(entry.match.date);
        return (
          matchDate >= new Date(startDate) && matchDate <= new Date(endDate)
        );
      }
      return true;
    });

    const absences = filteredUserMatchData.filter(
      (entry) => !entry.available
    ).length;

    const matchesPlayedCalc = totalMatches - absences;

    const totalMinutes = filteredUserMatchData
      .filter((entry) => entry.available)
      .reduce((sum, entry) => sum + entry.minutes, 0);

    const avgMinutesPlayedCalc =
      matchesPlayedCalc > 0 ? totalMinutes / matchesPlayedCalc : 0;

    return {
      matchesPlayed: matchesPlayedCalc,
      avgMinutesPlayed: avgMinutesPlayedCalc,
    };
  }, [initialPlayerStats, user.id, startDate, endDate, totalMatches]);

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
