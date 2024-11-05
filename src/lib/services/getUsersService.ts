import prisma from '@/lib/prisma';

interface UserWithOptionalMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  MatchPlayer?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
  }[];
}

export async function fetchUsers(
  includeMatchStats = false
): Promise<UserWithOptionalMatchStats[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
      ...(includeMatchStats && {
        MatchPlayer: {
          select: {
            id: true,
            matchId: true,
            userId: true,
            minutes: true,
            available: true,
          },
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
