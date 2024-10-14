import prisma from '@/lib/prisma';

export async function findOpponentById(pouleOpponentId: number) {
  return prisma.pouleOpponents.findUnique({
    where: { id: pouleOpponentId },
  });
}

export async function createMatch(pouleOpponentId: number, date: string) {
  return prisma.match.create({
    data: {
      pouleOpponentId,
      date: new Date(date),
      createdAt: new Date(),
    },
  });
}
