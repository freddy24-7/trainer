'use server';

import { getPoulesWithTeams } from '@/lib/services/getPouleService';
import { formatPoules } from '@/utils/pouleUtils';
import { Poule } from '@/types/type-list';

export async function getTeamsInPoule() {
  try {
    const poules = await getPoulesWithTeams();

    if (poules.length === 0) {
      return {
        success: false,
        error: 'No poules found. Please create a new poule.',
      };
    }

    const formattedPoules: Poule[] = formatPoules(poules);

    return {
      success: true,
      poules: formattedPoules,
      latestPoule: formattedPoules[0],
    };
  } catch (error) {
    console.error('Error fetching poules:', error);
    return {
      success: false,
      error: 'Failed to load teams in the poules.',
    };
  }
}
