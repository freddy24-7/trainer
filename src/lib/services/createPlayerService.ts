import prisma from '@/lib/prisma';

export async function createPlayerInDatabase({
  clerkId,
  username,
  whatsappNumber,
}: {
  clerkId: string;
  username: string;
  whatsappNumber: string;
}) {
  return prisma.user.create({
    data: {
      clerkId,
      username,
      whatsappNumber,
      role: 'PLAYER',
      createdAt: new Date(),
    },
  });
}
