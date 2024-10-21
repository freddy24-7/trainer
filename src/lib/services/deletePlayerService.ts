import { users } from '@clerk/clerk-sdk-node';
import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function handleFindPlayerById(
  playerId: number
): Promise<Pick<User, 'clerkId'> | null> {
  return prisma.user.findUnique({
    where: { id: playerId },
    select: { clerkId: true },
  });
}

export async function deletePlayerFromDatabase(
  playerId: number
): Promise<User> {
  return prisma.user.delete({
    where: { id: playerId },
  });
}

export async function deleteClerkUser(clerkId: string): Promise<void> {
  await users.deleteUser(clerkId);
}
