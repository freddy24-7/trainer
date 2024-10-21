'use server';

import { getMatchDataService } from '@/lib/services/getMatchDataService';
import { GetMatchDataResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapMatchData } from '@/utils/matchDataUtils';

export async function getMatchData(): Promise<GetMatchDataResponse> {
  try {
    const matches = await getMatchDataService();

    const matchData = handleMapMatchData(matches);

    return { success: true, matchData };
  } catch (error) {
    console.error('Error fetching match data:', error);
    const formattedError = formatError('Failed to fetch match data.', [
      'getMatchData',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
