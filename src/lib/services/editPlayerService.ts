import { createClerkClient } from '@clerk/backend';
import { User } from '@prisma/client';

import prisma from '@/lib/prisma';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

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
): Promise<any> {
  return clerk.users.updateUser(clerkId, data);
}
