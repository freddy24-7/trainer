import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function handleFindUserByClerkId(
  clerkId: string
): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  } catch (error) {
    console.error(`Error fetching user with Clerk ID ${clerkId}:`, error);
    throw new Error('Error fetching user from database');
  }
}

export async function updateUserUsername(
  clerkId: string,
  newUsername: string
): Promise<User> {
  try {
    return await prisma.user.update({
      where: { clerkId },
      data: { username: newUsername },
    });
  } catch (error) {
    console.error(
      `Error updating username for user with Clerk ID ${clerkId}:`,
      error
    );
    throw new Error('Error updating username');
  }
}
