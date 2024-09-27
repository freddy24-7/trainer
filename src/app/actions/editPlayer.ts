// This server action is used to edit a player in the database.

'use server';

import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';
import { ZodIssue } from 'zod';
import { editPlayerSchema } from '@/schemas/editPlayerSchema';

export default async function editPlayer(
  playerId: number,
  params: FormData
): Promise<{ errors: ZodIssue[]; success?: boolean }> {
  const username = params.get('username');
  const password = params.get('password');
  const whatsappNumber = params.get('whatsappNumber');

  if (username === null || whatsappNumber === null) {
    return {
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }

  const player = await prisma.user.findUnique({ where: { id: playerId } });
  if (!player || !player.clerkId || player.username === null) {
    return {
      errors: [
        {
          message: 'Player not found, Clerk ID missing, or username is null.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }

  const validation = editPlayerSchema.safeParse({
    username: username as string,
    password: password || undefined,
    whatsappNumber: whatsappNumber as string,
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const {
    username: validUsername,
    password: validPassword,
    whatsappNumber: validWhatsappNumber,
  } = validation.data;

  try {
    await users.updateUser(player.clerkId, {
      username: validUsername,
      password: validPassword || undefined,
    });

    await prisma.user.update({
      where: { id: playerId },
      data: { username: validUsername, whatsappNumber: validWhatsappNumber },
    });

    return { errors: [], success: true };
  } catch (error) {
    return {
      errors: [
        {
          message: 'Error updating the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }
}
