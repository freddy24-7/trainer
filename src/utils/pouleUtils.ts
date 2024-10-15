import { Poule } from '@/types/type-list';

/**
 * Formats the raw poules data into the Poule interface structure.
 *
 * @param poules - The raw poules data fetched from the service.
 * @returns An array of formatted Poule objects.
 */
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
