'use server';

import { createClerkClient } from '@clerk/backend';
import { ZodIssue } from 'zod';

import { createPlayerInDatabase } from '@/lib/services/createPlayerService';
import { handleValidatePlayerData } from '@/schemas/validation/createPlayerValidation';
import { errorRegisteringPlayer } from '@/strings/actionStrings';
import { formatError } from '@/utils/errorUtils';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

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
    const clerkUser = await clerk.users.createUser({
      username,
      password,
    });

    await createPlayerInDatabase({
      clerkId: clerkUser.id,
      username,
      whatsappNumber,
    });

    return { errors: [], success: true };
  } catch (error) {
    console.error(error);
    return formatError(errorRegisteringPlayer);
  }
}
