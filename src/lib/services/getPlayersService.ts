import prisma from '@/lib/prisma';

export async function fetchPlayers() {
  return prisma.user.findMany({
    where: {
      role: 'PLAYER',
    },
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
