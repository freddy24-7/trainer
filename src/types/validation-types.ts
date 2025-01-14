export interface MatchPlayerData {
  userId: number;
  matchId: number;
  minutes: number;
  available: boolean;
}

export interface MatchFormData {
  trainingMatch: boolean;
  pouleOpponentId: number | null;
  opponentName: string | null;
  date: string | null;
  players: {
    id: number;
    minutes: number;
    available: boolean;
  }[];
}
