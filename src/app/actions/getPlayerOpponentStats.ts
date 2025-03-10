'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import {
  UserWithOptionalMatchStats,
  PlayerOpponentStatData,
  BaseMatchStat,
} from '@/types/stats-types';

export async function getPlayerOpponentStats(): Promise<
  PlayerOpponentStatData[]
> {
  const players = await fetchPlayers();

  return players.map((player: UserWithOptionalMatchStats) => {
    const matchData: BaseMatchStat[] =
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
        .filter((match): match is BaseMatchStat => match !== null) || [];

    return {
      id: player.id,
      username: player.username,
      matchData,
    };
  });
}
