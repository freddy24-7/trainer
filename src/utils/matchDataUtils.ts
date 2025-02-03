import {
  unknownOpponentMessage,
  unknownPlayerMessage,
} from '@/strings/validationStrings';
import { MatchData, MatchDataHelper } from '@/types/match-types';

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
