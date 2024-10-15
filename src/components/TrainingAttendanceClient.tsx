import React from 'react';
import { TrainingAttendanceClientProps } from '@/types/type-list';
import PlayerAttendanceTable from '@/components/helpers/TrainingAttendanceTable';

const TrainingAttendanceClient: React.FC<TrainingAttendanceClientProps> = ({
  attendanceList,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PlayerAttendanceTable attendanceList={attendanceList} />{' '}
    </div>
  );
};

export default TrainingAttendanceClient;
