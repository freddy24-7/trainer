import { Match, Prisma, PouleOpponents } from '@prisma/client';

import prisma from '@/lib/prisma';
import { MatchData } from '@/types/match-types';

export async function createMatch(matchData: MatchData): Promise<Match> {
  const { matchType, date, pouleOpponentId, practiceOpponent } = matchData;

  return prisma.match.create({
    data: {
      matchType,
      date: date instanceof Date ? date : new Date(date),
      createdAt: new Date(),

      pouleOpponent:
        matchType === 'COMPETITION' && pouleOpponentId
          ? { connect: { id: pouleOpponentId } }
          : undefined,

      practiceOpponent: matchType === 'PRACTICE' ? practiceOpponent : null,
    } as Prisma.MatchCreateInput,
  });
}

export async function handleFindOpponentById(
  pouleOpponentId: number
): Promise<PouleOpponents | null> {
  return prisma.pouleOpponents.findUnique({
    where: { id: pouleOpponentId },
  });
}
