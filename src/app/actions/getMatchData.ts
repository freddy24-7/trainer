'use server';

import { getMatchDataService } from '@/lib/services/getMatchDataService';
import { GetMatchDataResponse } from '@/types/type-list';
import { mapMatchData } from '@/utils/matchDataUtils';
import { formatError } from '@/utils/errorUtils';

export async function getMatchData(): Promise<GetMatchDataResponse> {
  try {
    const matches = await getMatchDataService();

    const matchData = mapMatchData(matches);

    return { success: true, matchData };
  } catch (error) {
    const formattedError = formatError('Failed to fetch match data.', [
      'getMatchData',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
