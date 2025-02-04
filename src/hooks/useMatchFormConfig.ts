import { useForm, UseFormReturn } from 'react-hook-form';

import { MatchFormValues } from '@/types/match-types';
import { Poule } from '@/types/poule-types';
import { Player } from '@/types/user-types';

export const useMatchFormConfig = (
  poules: Poule[],
  players: Player[]
): UseFormReturn<MatchFormValues> => {
  return useForm<MatchFormValues>({
    defaultValues: {
      matchType: 'competition',
      poule: poules.length > 0 ? poules[0].id : undefined,
      opponent:
        poules.length > 0 && poules[0].opponents.length > 0
          ? poules[0].opponents[0].id
          : undefined,
      opponentName: '',
      date: undefined,
      players: players.map((player) => ({
        id: player.id,
        minutes: 0,
        available: true,
      })),
      matchEvents: [],
    },
  });
};
