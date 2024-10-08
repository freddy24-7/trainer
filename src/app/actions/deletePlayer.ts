'use server';

import { users } from '@clerk/clerk-sdk-node';

import prisma from '@/lib/prisma';

export async function deletePlayer(
  playerId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const player = await prisma.user.findUnique({
      where: { id: playerId },
      select: { clerkId: true },
    });

    if (!player || !player.clerkId) {
      return {
        success: false,
        error: 'Player not found or Clerk ID is missing.',
      };
    }

    await users.deleteUser(player.clerkId);

    await prisma.user.delete({
      where: { id: playerId },
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Error deleting the player.' };
  }
}
