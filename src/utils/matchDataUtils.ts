import { MatchData, MatchDataHelper } from '@/types/match-types';

export function mapMatchData(matches: MatchDataHelper[]): MatchData[] {
  return matches.map((match) => ({
    id: match.id,
    date: match.date,
    opponentTeamName: match.pouleOpponent.team?.name ?? 'Unknown Opponent',
    absentPlayers: match.matchPlayers.map(
      (mp) => mp.user.username ?? 'Unknown Player'
    ),
  }));
}
