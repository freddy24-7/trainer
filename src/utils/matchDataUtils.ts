import {
  unknownOpponentMessage,
  unknownPlayerMessage,
} from '@/strings/validationStrings';
import { MatchData } from '@/types/match-types';
import { MatchDataHelper } from '@/types/stats-types';

export function handleMapMatchData(matches: MatchDataHelper[]): MatchData[] {
  return matches.map((match) => ({
    id: match.id,
    date: match.date,
    opponentStrength: match.opponentStrength ?? null,
    opponentTeamName: match.pouleOpponent.team?.name ?? unknownOpponentMessage,
    absentPlayers: match.matchPlayers.map(
      (mp) => mp.user.username ?? unknownPlayerMessage
    ),
  }));
}
