import { getPoulesWithTeams } from '@/lib/services/getPouleService';
import {
  noPoulesFound,
  failedToLoadTeamsInPoules,
} from '@/strings/actionStrings';
import { Poule } from '@/types/poule-types';
import {
  GetTeamsInPouleResponse,
  GetTeamsInPouleError,
} from '@/types/response-types';
import { Team } from '@/types/team-types';
import { formatError } from '@/utils/errorUtils';
import { handleFormatPoules } from '@/utils/pouleUtils';

export async function getTeamsInPoule(): Promise<GetTeamsInPouleResponse> {
  try {
    const poules = await getPoulesWithTeams();

    if (poules.length === 0) {
      return formatError(
        noPoulesFound,
        ['poules'],
        'custom',
        true
      ) as GetTeamsInPouleError;
    }

    const formattedPoules: Poule[] = handleFormatPoules(
      poules.map((poule) => ({
        ...poule,
        team: poule.team as Team,
        opponents: poule.opponents.map((opponent, index) => ({
          id: (opponent as { id?: number }).id ?? index,
          team: opponent.team as Team,
        })),
      }))
    );

    return {
      success: true,
      poules: formattedPoules,
      latestPoule: formattedPoules[0],
    };
  } catch (error) {
    console.error(failedToLoadTeamsInPoules, error);
    return formatError(
      failedToLoadTeamsInPoules,
      ['poules'],
      'custom',
      true
    ) as GetTeamsInPouleError;
  }
}
