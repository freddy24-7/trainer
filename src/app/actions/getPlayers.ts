// This server action is used to get all players from the database.

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPlayers() {
  try {
    const players = await prisma.user.findMany({
      where: {
        role: 'PLAYER',
      },
      select: {
        id: true,
        username: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    revalidatePath('/player/management');

    return { success: true, players };
  } catch (error) {
    return { success: false, error: 'Error fetching players.' };
  }
}
