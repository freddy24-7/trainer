'use server';

import { getMatchDataService } from '@/lib/services/getMatchDataService';
import { errorFetchingMatchData } from '@/strings/actionStrings';
import { GetMatchDataResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleMapMatchData } from '@/utils/matchDataUtils';

export async function getMatchData(): Promise<GetMatchDataResponse> {
  try {
    const matches = await getMatchDataService();

    const matchData = handleMapMatchData(matches);

    return { success: true, matchData };
  } catch (error) {
    console.error(errorFetchingMatchData, error);
    const formattedError = formatError(errorFetchingMatchData, [
      'getMatchData',
    ]);
    return { success: false, error: formattedError.errors[0].message };
  }
}
