// This server action is used to get all players from the database.

'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    return { success: true, players };
  } catch (error) {
    console.error('Error fetching players:', error);
    return { success: false, error: 'Error fetching players.' };
  } finally {
    await prisma.$disconnect();
  }
}
