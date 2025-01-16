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
  opponentStrength,
  events,
}: {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string;
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  events?: {
    matchId?: number;
    playerInId?: number | null;
    playerOutId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
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
      opponentStrength: opponentStrength ?? null,
      matchEvents:
        events && events.length > 0
          ? {
              create: events.map((event) => ({
                playerInId: event.playerInId,
                playerOutId: event.playerOutId,
                minute: event.minute,
                eventType: event.eventType,
                substitutionReason: event.substitutionReason ?? null,
              })),
            }
          : undefined,
    },
  });
}
