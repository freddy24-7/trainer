import prisma from '@/lib/prisma';

export async function getTrainingAttendanceFromDB() {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    include: {
      TrainingPlayer: {
        where: { absent: true },
      },
    },
  });
}
