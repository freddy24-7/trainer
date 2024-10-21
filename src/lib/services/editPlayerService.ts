import { users } from '@clerk/clerk-sdk-node';
import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function handleFindPlayerById(
  playerId: number
): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: playerId } });
}

export async function updatePlayerInDatabase(
  playerId: number,
  data: { username: string; whatsappNumber: string }
): Promise<User> {
  return prisma.user.update({
    data,
    where: { id: playerId },
  });
}

export async function updateClerkUser(
  clerkId: string,
  data: { username: string; password?: string }
): Promise<import('@clerk/clerk-sdk-node').User> {
  return users.updateUser(clerkId, data);
}
