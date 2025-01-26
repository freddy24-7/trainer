'use client';

import React, { useState } from 'react';

import DateFilter from '@/components/DateFilter';
import AttendanceTraining from '@/components/helpers/statsHelpers/AttendanceTraining';
import DataTrainingClient from '@/components/helpers/statsHelpers/DataTrainingClient';
import { TrainingData, PlayerAttendance } from '@/types/training-types';

interface FilterableTrainingListProps {
  trainingData: TrainingData[];
  attendanceList: PlayerAttendance[];
}

const FilterableTrainingList: React.FC<FilterableTrainingListProps> = ({
  trainingData,
  attendanceList,
}) => {
  const [filteredTrainingData, setFilteredTrainingData] =
    useState(trainingData);
  const [filteredAttendanceList, setFilteredAttendanceList] =
    useState(attendanceList);

  const handleDateFilter = (
    startDate: Date | null,
    endDate: Date | null
  ): void => {
    if (!startDate || !endDate) return;

    const filteredTrainings = trainingData.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });

    const filteredAttendance = attendanceList.filter((attendance) =>
      filteredTrainings.some((session) => session.id === attendance.playerId)
    );

    setFilteredTrainingData(filteredTrainings);
    setFilteredAttendanceList(filteredAttendance);
  };

  return (
    <div>
      <DateFilter onFilter={handleDateFilter} label="Change Dates" />

      <DataTrainingClient trainingData={filteredTrainingData} />
      <h2 className="text-xl font-semibold text-center mt-6 mb-4">
        Player Attendance
      </h2>
      <AttendanceTraining attendanceList={filteredAttendanceList} />
    </div>
  );
};

export default FilterableTrainingList;
