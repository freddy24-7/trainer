'use server';

import { users } from '@clerk/clerk-sdk-node';
import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import { editPlayerSchema } from '@/schemas/editPlayerSchema';

export default async function handleEditPlayer(
  playerId: number,
  params: FormData
): Promise<{ errors: ZodIssue[]; success?: boolean }> {
  const { errors: paramErrors, data: paramData } = handleValidateParams(params);
  if (paramErrors.length > 0) {
    return { errors: paramErrors };
  }

  const { errors: playerErrors, player } = await fetchPlayer(playerId);
  if (playerErrors.length > 0) {
    return { errors: playerErrors };
  }

  const validation = editPlayerSchema.safeParse(paramData);
  if (!validation.success) {
    return { errors: validation.error.issues };
  }

  if (player && player.clerkId && player.username) {
    try {
      await updateClerkUser(player.clerkId, validation.data);
      await updateDatabaseUser(playerId, validation.data);
      return { errors: [], success: true };
    } catch (error) {
      console.error('Error updating the player:', error);
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
  } else {
    return {
      errors: [
        {
          message: 'Player not found or missing Clerk ID or username.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }
}

function handleValidateParams(params: FormData): {
  errors: ZodIssue[];
  data?: { username: string; password?: string; whatsappNumber: string };
} {
  const username = params.get('username');
  const password = params.get('password');
  const whatsappNumber = params.get('whatsappNumber');

  const errors: ZodIssue[] = [];
  if (username === null || whatsappNumber === null) {
    errors.push({
      message: 'Username and WhatsApp number are required.',
      path: ['form'],
      code: 'custom',
    });
    return { errors };
  }

  return {
    errors: [],
    data: {
      username: username as string,
      password: password as string,
      whatsappNumber: whatsappNumber as string,
    },
  };
}

interface Player {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  clerkId: string | null;
}

async function fetchPlayer(
  playerId: number
): Promise<{ errors: ZodIssue[]; player?: Player }> {
  const player = await prisma.user.findUnique({ where: { id: playerId } });
  const errors: ZodIssue[] = [];

  if (
    !player ||
    !player.clerkId ||
    player.username === null ||
    player.whatsappNumber === null
  ) {
    errors.push({
      message:
        'Player not found, Clerk ID, username, or WhatsApp number is missing.',
      path: ['form'],
      code: 'custom',
    });
    return { errors };
  }

  return { errors, player };
}

async function updateClerkUser(
  clerkId: string,
  data: { username: string; password?: string }
): Promise<void> {
  await users.updateUser(clerkId, {
    username: data.username,
    password: data.password || undefined,
  });
}

async function updateDatabaseUser(
  playerId: number,
  data: { username: string; whatsappNumber: string }
): Promise<void> {
  await prisma.user.update({
    where: { id: playerId },
    data: { username: data.username, whatsappNumber: data.whatsappNumber },
  });
}
