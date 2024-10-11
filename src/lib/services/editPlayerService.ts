import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';

export async function findPlayerById(playerId: number) {
  return prisma.user.findUnique({ where: { id: playerId } });
}

export async function updatePlayerInDatabase(
  playerId: number,
  data: { username: string; whatsappNumber: string }
) {
  return prisma.user.update({
    data,
    where: { id: playerId },
  });
}

export async function updateClerkUser(
  clerkId: string,
  data: { username: string; password?: string }
) {
  return await users.updateUser(clerkId, data);
}
