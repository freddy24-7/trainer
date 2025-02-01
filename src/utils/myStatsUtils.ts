import { TrainingData, PlayerAttendance } from '@/types/training-types';

export const calculateTrainingStats = (
  trainingData: TrainingData[],
  attendanceList: PlayerAttendance[],
  userId: string
): { totalTrainings: number; attendedTrainings: number } => {
  if (!Array.isArray(trainingData)) {
    console.error('trainingData is not an array:', trainingData);
    return { totalTrainings: 0, attendedTrainings: 0 };
  }

  if (!Array.isArray(attendanceList)) {
    console.error('attendanceList is not an array:', attendanceList);
    return { totalTrainings: 0, attendedTrainings: 0 };
  }

  const playerAttendance = attendanceList.find(
    (attendance) => attendance.playerId.toString() === userId
  );

  const totalTrainings = trainingData.length;
  const attendedTrainings =
    totalTrainings - (playerAttendance?.absences ?? totalTrainings);

  return { totalTrainings, attendedTrainings };
};
