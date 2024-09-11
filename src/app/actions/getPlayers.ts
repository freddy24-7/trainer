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

    // Ensuring the data is serialized into a plain object
    const serializedPlayers = JSON.parse(
      JSON.stringify(players, (_, value) => {
        // Ensure `username` is a string to avoid null issues
        if (value === null) return '';
        return value;
      })
    );

    return { success: true, players: serializedPlayers };
  } catch (error) {
    console.error('Error fetching players:', error);
    return { success: false, error: 'Error fetching players.' };
  } finally {
    await prisma.$disconnect();
  }
}
