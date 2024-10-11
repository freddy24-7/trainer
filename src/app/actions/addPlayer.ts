'use server';

import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';
import { validatePlayerData } from '@/schemas/validation/createPlayerValidation';
import { createPlayerInDatabase } from '@/lib/services/createPlayerService';
import { formatError } from '@/utils/errorUtils';

export default async function addPlayer(
  _prevState: any,
  params: FormData
): Promise<{ errors: any[]; success?: boolean }> {
  const validation = validatePlayerData(params);
  if (!validation.success) {
    return {
      errors: validation.errors || [],
    };
  }

  const { username, password, whatsappNumber } = validation.data;

  try {
    const clerkUser = await users.createUser({
      username,
      password,
    });

    await createPlayerInDatabase({
      clerkId: clerkUser.id,
      username,
      whatsappNumber,
    });

    revalidatePath('/player-management');

    return { errors: [], success: true };
  } catch (error) {
    return formatError('Error registering the player.');
  }
}
