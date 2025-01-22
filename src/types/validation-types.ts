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
  opponentStrength?: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  matchEvents?: {
    playerInId?: number | null;
    playerOutId?: number | null;
    playerId?: number | null;
    minute: number;
    eventType: 'SUBSTITUTION_IN' | 'SUBSTITUTION_OUT' | 'GOAL' | 'ASSIST';
    substitutionReason?: 'TACTICAL' | 'FITNESS' | 'INJURY' | 'OTHER' | null;
  }[];
}
