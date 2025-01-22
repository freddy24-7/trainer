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
  matchEvents,
}: {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string;
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  matchEvents?: {
    playerInId?: number | null;
    playerOutId?: number | null;
    playerId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT' | 'GOAL' | 'ASSIST';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
}): Promise<Match> {
  console.log('Creating match with data:', {
    trainingMatch,
    pouleOpponentId,
    opponentName,
    date,
    opponentStrength,
    matchEvents,
  });

  try {
    const match = await prisma.match.create({
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
          matchEvents && matchEvents.length > 0
            ? {
                create: matchEvents.map((matchEvent) => ({
                  playerInId: matchEvent.playerInId,
                  playerOutId: matchEvent.playerOutId,
                  playerId: matchEvent.playerId ?? null,
                  minute: matchEvent.minute,
                  eventType: matchEvent.eventType,
                  substitutionReason: matchEvent.substitutionReason ?? null,
                })),
              }
            : undefined,
      },
    });

    console.log('Match created successfully:', match);
    return match;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
}
