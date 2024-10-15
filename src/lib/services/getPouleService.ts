import prisma from '@/lib/prisma';

export async function getPoulesWithTeams() {
  try {
    return await prisma.poule.findMany({
      include: {
        team: true,
        opponents: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    throw new Error('Failed to load poules');
  }
}
