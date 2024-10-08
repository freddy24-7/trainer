'use server';

import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';
import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import { createPlayerSchema } from '@/schemas/createPlayerSchema';

export default async function createPlayer(
  _prevState: unknown,
  params: FormData
): Promise<{ errors: ZodIssue[]; success?: boolean }> {
  const validation = createPlayerSchema.safeParse({
    username: params.get('username'),
    password: params.get('password'),
    whatsappNumber: params.get('whatsappNumber'),
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const { username, password, whatsappNumber } = validation.data;

  try {
    const clerkUser = await users.createUser({
      username,
      password,
    });

    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        username,
        whatsappNumber,
        role: 'PLAYER',
        createdAt: new Date(),
      },
    });

    revalidatePath('/player-management');

    return { errors: [], success: true };
  } catch {
    return {
      errors: [
        {
          message: 'Error registering the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }
}
