import prisma from '@/lib/prisma';

export async function addMatchPlayerToDatabase(data: {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}) {
  return prisma.matchPlayer.create({
    data: {
      userId: data.userId,
      matchId: data.matchId,
      minutes: data.minutes,
      available: data.available,
    },
  });
}
