// This server action is used to delete a player from the database and Clerk.

'use server';

import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node'; // Import Clerk SDK users

export async function deletePlayer(playerId: number) {
  try {
    // Retrieving the player to get the Clerk ID
    const player = await prisma.user.findUnique({
      where: { id: playerId },
      select: { clerkId: true },
    });

    // If the player or Clerk ID is missing, return a failure response
    if (!player || !player.clerkId) {
      console.error('Player not found or Clerk ID is missing.');
      return {
        success: false,
        error: 'Player not found or Clerk ID is missing.',
      };
    }

    // Delete the user from Clerk
    await users.deleteUser(player.clerkId);

    // Delete the player from the database
    await prisma.user.delete({
      where: { id: playerId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting player:', error);
    return { success: false, error: 'Error deleting the player.' };
  }
}
