// This server action is used to delete a player from the database.

'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deletePlayer(playerId: number) {
  try {
    await prisma.user.delete({
      where: { id: playerId },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting player:', error);
    return { success: false, error: 'Error deleting the player.' };
  } finally {
    await prisma.$disconnect();
  }
}
