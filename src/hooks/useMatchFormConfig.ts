import { useForm } from 'react-hook-form';
import { FormValues } from '@/types/form-types';
import { Player } from '@/types/user-types';
import { Poule } from '@/types/poule-types';

export const useMatchFormConfig = (poules: Poule[], players: Player[]) => {
  return useForm<FormValues>({
    defaultValues: {
      poule: poules.length > 0 ? poules[0].id : undefined,
      opponent:
        poules.length > 0 && poules[0].opponents.length > 0
          ? poules[0].opponents[0].id
          : undefined,
      date: null,
      players: players.map((player) => ({
        id: player.id,
        minutes: '',
        available: true,
      })),
    },
  });
};
