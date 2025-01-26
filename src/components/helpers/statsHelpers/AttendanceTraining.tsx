import React from 'react';

import PlayerAttendanceTable from '@/components/helpers/trainingHelpers/TrainingAttendanceTable';
import { TrainingAttendanceClientProps } from '@/types/training-types';

const AttendanceTraining: React.FC<TrainingAttendanceClientProps> = ({
  attendanceList,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PlayerAttendanceTable attendanceList={attendanceList} />{' '}
    </div>
  );
};

export default AttendanceTraining;
