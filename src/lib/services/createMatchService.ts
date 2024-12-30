import { PouleOpponents, Match } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function handleFindOpponentById(
  pouleOpponentId: number
): Promise<PouleOpponents | null> {
  return prisma.pouleOpponents.findUnique({
    where: { id: pouleOpponentId },
  });
}

export async function createMatch(
  pouleOpponentId: number,
  date: string
): Promise<Match> {
  return prisma.match.create({
    data: {
      pouleOpponentId,
      date: new Date(date),
      createdAt: new Date(),
    },
  });
}
