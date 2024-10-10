'use server';

import { fetchPlayersFromDB } from '@/lib/services/prismaPlayerService';
import { Player } from '@/type-list/types';
import { createSuccessResponse, handleError } from '@/utils/responseUtils';

export async function getPlayers(): Promise<{
  success: boolean;
  players?: Player[];
  error?: string;
}> {
  try {
    const players = await fetchPlayersFromDB();
    return createSuccessResponse(players);
  } catch {
    return handleError('Error fetching players.');
  }
}
