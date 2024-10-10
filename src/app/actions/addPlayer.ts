'use server';

import { ZodIssue } from 'zod';

import { handleRevalidatePlayerManagementCache } from '@/lib/cache/revalidation';
import { createClerkUser } from '@/lib/services/clerkCreatePlayerService';
import { createPrismaUser } from '@/lib/services/prismaCreatePlayerService';
import { handleValidatePlayerData } from '@/schemas/validation/playerCreationValidation';
import {
  ValidatePlayerDataResult,
  CreateClerkUserResult,
} from '@/type-list/types';
import {
  createValidationErrorResponse,
  handleError,
} from '@/utils/responseUtils';

export default async function createPlayer(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[] | { message: string }[]; success?: boolean }> {
  try {
    // Step 1: Validate the input
    const { errors: validationErrors, data }: ValidatePlayerDataResult =
      handleValidatePlayerData(params);

    if (validationErrors.length > 0 || !data) {
      return createValidationErrorResponse('Validation error.', 'form');
    }

    const { username, password, whatsappNumber } = data;

    // Step 2: Create user in Clerk system
    const { clerkUser, error: clerkError }: CreateClerkUserResult =
      await createClerkUser(username, password);

    if (clerkError) {
      return createValidationErrorResponse(clerkError, 'clerk');
    }

    // Step 3: Create user in Prisma database
    await createPrismaUser(clerkUser!.id, username, whatsappNumber);

    // Step 4: Revalidate the player management cache
    handleRevalidatePlayerManagementCache();

    return { errors: [], success: true }; // Success
  } catch (error) {
    console.error('Error creating player:', error);
    return handleError('Error creating player.');
  }
}
