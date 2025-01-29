'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import {
  UserWithOptionalMatchStats,
  PlayerOpponentStatData,
  MatchStat,
} from '@/types/match-types';

export async function getPlayerOpponentStats(): Promise<
  PlayerOpponentStatData[]
> {
  const players = await fetchPlayers();

  return players.map((player: UserWithOptionalMatchStats) => {
    const matchData: MatchStat[] =
      player.matchPlayers
        ?.map((mp) => {
          if (!mp.match) {
            console.warn(`Match data missing for matchPlayerId: ${mp.id}`);
            return null;
          }

          return {
            id: mp.matchId,
            date: mp.match.date,
            opponentStrength: mp.match.opponentStrength ?? null,
            minutes: mp.minutes,
            available: mp.available,
          };
        })
        .filter((match): match is MatchStat => match !== null) || [];

    return {
      id: player.id,
      username: player.username,
      matchData,
    };
  });
}
