import prisma from '@/lib/prisma';

interface UserFetching {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  clerkId: string | null;
  role: string | null;
}

export async function getUserByField(
  field: 'id' | 'clerkId',
  value: number | string
): Promise<UserFetching | null> {
  const whereClause =
    field === 'id' ? { id: value as number } : { clerkId: value as string };

  const user = await prisma.user.findUnique({
    where: whereClause,
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    whatsappNumber: user.whatsappNumber,
    clerkId: user.clerkId,
    role: user.role,
  };
}
