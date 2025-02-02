import { fetchGoalsByPlayer } from '@/lib/services/getGoalsByPlayerService';
import { OpponentStrength } from '@/types/match-types';

export interface PlayerGoals {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date;
    opponentStrength: OpponentStrength | null;
    minutes: number;
    available: boolean;
    goals: number;
  }[];
}

export async function getGoalsByPlayer(): Promise<PlayerGoals[]> {
  try {
    return await fetchGoalsByPlayer();
  } catch (error) {
    console.error('Error fetching player goals:', error);
    throw error;
  }
}
