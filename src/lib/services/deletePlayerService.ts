import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';

export async function findPlayerById(playerId: number) {
  return prisma.user.findUnique({
    where: { id: playerId },
    select: { clerkId: true },
  });
}

export async function deletePlayerFromDatabase(playerId: number) {
  return prisma.user.delete({
    where: { id: playerId },
  });
}

export async function deleteClerkUser(clerkId: string) {
  return users.deleteUser(clerkId);
}
