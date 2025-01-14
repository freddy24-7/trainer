import { PouleOpponents, Match } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function handleFindOpponentById(
  pouleOpponentId: number
): Promise<PouleOpponents | null> {
  return prisma.pouleOpponents.findUnique({
    where: { id: pouleOpponentId },
  });
}

export async function createMatch({
  trainingMatch,
  pouleOpponentId,
  opponentName,
  date,
}: {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string;
}): Promise<Match> {
  return prisma.match.create({
    data: {
      trainingMatch,
      pouleOpponentId: trainingMatch
        ? undefined
        : (pouleOpponentId ?? undefined),
      opponentName: trainingMatch ? opponentName : undefined,
      date: new Date(date),
      createdAt: new Date(),
    },
  });
}
