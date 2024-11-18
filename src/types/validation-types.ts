export interface MatchPlayerData {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}

export interface MatchFormData {
  pouleOpponentId: number;
  date: string | null;
}
