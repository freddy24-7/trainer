import { Poule } from '@/types/type-list';

export function formatPoules(poules: any[]): Poule[] {
  return poules.map((poule) => ({
    id: poule.id,
    pouleName: poule.name,
    teams: [
      poule.team,
      ...poule.opponents.map((opponent: any) => opponent.team),
    ],
    opponents: poule.opponents.map((opponent: any) => ({
      id: opponent.id,
      team: opponent.team,
    })),
  }));
}
