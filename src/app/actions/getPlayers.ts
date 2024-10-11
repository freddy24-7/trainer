'use server';

import { fetchPlayers } from '@/lib/services/getPlayersService';
import { revalidatePath } from 'next/cache';
import { formatError } from '@/utils/errorUtils';

export default async function getPlayers(): Promise<{
  success?: boolean;
  players?: any[];
  errors?: any[];
}> {
  try {
    const players = await fetchPlayers();

    revalidatePath('/player/management');

    return { success: true, players };
  } catch (error) {
    return formatError('Error fetching players.');
  }
}
