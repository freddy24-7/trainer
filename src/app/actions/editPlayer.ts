// This server action is used to edit a player in the database.

'use server';

import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';

export async function editPlayer(
  playerId: number,
  data: { username: string; password: string }
) {
  const { username, password } = data;

  try {
    const player = await prisma.user.findUnique({ where: { id: playerId } });
    if (!player || !player.clerkId) {
      return { success: false, error: 'Player not found or Clerk ID missing.' };
    }
    await users.updateUser(player.clerkId!, {
      username: username ?? player.username,
      password,
    });
    await prisma.user.update({
      where: { id: playerId },
      data: { username },
    });

    return { success: true };
  } catch (error) {
    console.error('Error editing player:', error);
    return { success: false, error: 'Error updating the player.' };
  }
}
