import { FormValues, Poule, Player } from '@/types/types';

export function getDefaultFormValues(
  poules: Poule[],
  players: Player[]
): FormValues {
  return {
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
  };
}
