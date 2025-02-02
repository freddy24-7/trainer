import { fetchAssistsByPlayer } from '@/lib/services/getAssistByPlayerService';
import { OpponentStrength } from '@/types/match-types';

export async function getAssistsByPlayer(): Promise<
  {
    id: number;
    username: string | null;
    matchData: {
      id: number;
      date: Date;
      opponentStrength: OpponentStrength | null;
      minutes: number;
      available: boolean;
      assists: number;
    }[];
  }[]
> {
  try {
    return await fetchAssistsByPlayer();
  } catch (error) {
    console.error('Error fetching player assists:', error);
    throw error;
  }
}
