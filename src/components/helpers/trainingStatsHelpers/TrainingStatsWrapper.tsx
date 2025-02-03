'use client';

import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import DateFilter from '@/components/DateFilter';
import TrainingAbsenceTable from '@/components/helpers/trainingStatsHelpers/TrainingAbsenceTable';
import TrainingStatsTable from '@/components/helpers/trainingStatsHelpers/TrainingStatsTable';
import { TrainingStatsWrapperProps } from '@/types/training-types';

const TrainingStatsWrapper: React.FC<TrainingStatsWrapperProps> = ({
  initialTrainingData,
}) => {
  const methods = useForm();
  const { watch, setValue } = methods;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const filteredTrainingData = useMemo(() => {
    return initialTrainingData.filter((training) => {
      const trainingDate = new Date(training.date);
      return startDate && endDate
        ? trainingDate >= new Date(startDate) &&
            trainingDate <= new Date(endDate)
        : true;
    });
  }, [initialTrainingData, startDate, endDate]);

  const playerTrainingStats = useMemo(() => {
    const playerStats: Record<
      number,
      { username: string; totalMissed: number }
    > = {};

    filteredTrainingData.forEach((training) => {
      training.players.forEach((player) => {
        if (!playerStats[player.id]) {
          playerStats[player.id] = {
            username: player.username || 'Unknown',
            totalMissed: 0,
          };
        }
        if (player.absent) {
          playerStats[player.id].totalMissed += 1;
        }
      });
    });

    return Object.entries(playerStats).map(([id, data]) => ({
      id: Number(id),
      username: data.username,
      totalMissed: data.totalMissed,
    }));
  }, [filteredTrainingData]);

  const trainingAbsenceData = useMemo(() => {
    return filteredTrainingData
      .map((training) => {
        const absentPlayers = training.players.filter(
          (player) => player.absent
        );
        return {
          id: training.id,
          date: new Date(training.date),
          formattedDate: new Date(training.date).toLocaleDateString(),
          absences:
            absentPlayers.length > 0
              ? absentPlayers.map((p) => p.username).join(', ')
              : 'All players present',
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredTrainingData]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <DateFilter
          onFilter={(startDate, endDate) => {
            setValue('startDate', startDate);
            setValue('endDate', endDate);
          }}
        />
        <div className="flex justify-center">
          <div className="mt-8 w-full max-w-4xl">
            <TrainingStatsTable trainingStats={playerTrainingStats} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mt-8 w-full max-w-4xl">
            <TrainingAbsenceTable absenceData={trainingAbsenceData} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TrainingStatsWrapper;
