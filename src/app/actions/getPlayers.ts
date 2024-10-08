'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { Player } from '@/types/types';

export async function getPlayers(): Promise<{
  success: boolean;
  players?: Player[];
  error?: string;
}> {
  try {
    const players = await prisma.user.findMany({
      where: {
        role: 'PLAYER',
      },
      select: {
        id: true,
        username: true,
        whatsappNumber: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    revalidatePath('/player/management');

    return { success: true, players };
  } catch {
    return { success: false, error: 'Error fetching players.' };
  }
}
