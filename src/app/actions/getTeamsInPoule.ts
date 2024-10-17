'use server';
import { getPoulesWithTeams } from '@/lib/services/getPouleService';
import { formatPoules } from '@/utils/pouleUtils';
import { Poule } from '@/types/poule-types';
import {
  GetTeamsInPouleResponse,
  GetTeamsInPouleError,
} from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';

export async function getTeamsInPoule(): Promise<GetTeamsInPouleResponse> {
  try {
    const poules = await getPoulesWithTeams();

    if (poules.length === 0) {
      return formatError(
        'No poules found. Please create a new poule.',
        ['poules'],
        'custom',
        true
      ) as GetTeamsInPouleError;
    }

    const formattedPoules: Poule[] = formatPoules(poules);

    return {
      success: true,
      poules: formattedPoules,
      latestPoule: formattedPoules[0],
    };
  } catch (error) {
    console.error('Error fetching poules:', error);
    return formatError(
      'Failed to load teams in the poules.',
      ['poules'],
      'custom',
      true
    ) as GetTeamsInPouleError;
  }
}
