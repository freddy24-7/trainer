import {
  MatchEvent,
  EventType,
  SubstitutionReason,
  Prisma,
} from '@prisma/client';

import prisma from '@/lib/prisma';

interface CreateMatchEventParams {
  matchId: number;
  userId: number;
  minute: number;
  eventType: EventType;
  substitutionReason?: SubstitutionReason | null;
  goalScorerId?: number | null;
  assistingUserId?: number | null;
  playerInId?: number | null;
  playerOutId?: number | null;
}

export async function addMatchEventToDatabase(
  params: CreateMatchEventParams
): Promise<MatchEvent> {
  const {
    matchId,
    minute,
    eventType,
    substitutionReason,
    goalScorerId,
    assistingUserId,
    playerInId,
    playerOutId,
  } = params;

  return prisma.matchEvent.create({
    data: {
      match: { connect: { id: matchId } },
      minute,
      eventType,
      substitutionReason:
        eventType === 'SUBSTITUTION_IN' || eventType === 'SUBSTITUTION_OUT'
          ? substitutionReason
          : null,
      goalScorer:
        eventType === 'GOAL' && goalScorerId
          ? { connect: { id: goalScorerId } }
          : null,
      assistUser:
        eventType === 'ASSIST' && assistingUserId
          ? { connect: { id: assistingUserId } }
          : null,
      playerIn:
        eventType === 'SUBSTITUTION_IN' && playerInId
          ? { connect: { id: playerInId } }
          : null,
      playerOut:
        eventType === 'SUBSTITUTION_OUT' && playerOutId
          ? { connect: { id: playerOutId } }
          : null,
    } as Prisma.MatchEventCreateInput,
  });
}
