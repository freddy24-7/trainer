import { OpponentStrength } from '@prisma/client';

import {
  SubstitutionMatchStats,
  SubstitutionOutStatData,
} from '@/types/match-types';

export function handlePlayerSubstitutionData(
  players: SubstitutionMatchStats[]
): SubstitutionOutStatData[] {
  return players.map((player) => {
    const matchData = (player.substitutedOut ?? [])
      .map((event) => {
        if (!event.match || !event.match.date) {
          console.warn(`⚠️ Missing match or date for event ${event.id}`);
          return null;
        }
        return {
          id: event.matchId,
          date: event.match.date,
          opponentStrength:
            event.match.opponentStrength ?? (null as OpponentStrength | null),
        };
      })
      .filter(
        (
          item
        ): item is {
          id: number;
          date: Date;
          opponentStrength: OpponentStrength | null;
        } => item !== null
      );

    return {
      id: player.id,
      username: player.username ?? 'Unknown',
      matchData,
    };
  });
}
