'use server';

import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';
import { ZodIssue } from 'zod';

import { createPlayerInDatabase } from '@/lib/services/createPlayerService';
import { handleValidatePlayerData } from '@/schemas/validation/createPlayerValidation';
import { formatError } from '@/utils/errorUtils';

export default async function addPlayer(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[]; success?: boolean }> {
  const validation = handleValidatePlayerData(params);

  if (!validation.success || !validation.data) {
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
    console.error(error);
    return formatError('Error registering the player.');
  }
}
