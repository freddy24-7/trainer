import prisma from '@/lib/prisma';

export async function getTrainingDataPlayers() {
  try {
    const trainingData = await prisma.training.findMany({
      include: {
        trainingPlayers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return trainingData.map((training) => ({
      id: training.id,
      date: training.date,
      players: training.trainingPlayers.map((tp) => ({
        id: tp.user.id,
        username: tp.user.username,
        absent: tp.absent,
      })),
    }));
  } catch (error) {
    console.error('Error fetching training data:', error);
    throw new Error('Failed to fetch training data');
  }
}
