// This server action is used to add a player to the database.

'use server';

import { PrismaClient } from '@prisma/client';
import { users } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();

export async function addPlayer(data: { username: string; password: string }) {
  const { username, password } = data;

  try {
    // Registering the player in Clerk using the users object from Clerk SDK
    const clerkUser = await users.createUser({
      username: username,
      password: password,
    });

    // Saving the player to database with the Clerk ID using PrismaClient
    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        username: username,
        role: 'PLAYER',
        createdAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding player:', error);
    return { success: false, error: 'Error registering the player.' };
  } finally {
    await prisma.$disconnect();
  }
}
