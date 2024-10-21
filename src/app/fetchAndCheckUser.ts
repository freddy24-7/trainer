import { auth } from '@clerk/nextjs';

import prisma from '@/lib/prisma';

interface SignedInUser {
  id: string;
  username: string;
  role: string | null;
}

export async function fetchAndCheckUser(): Promise<SignedInUser | null> {
  const { userId } = auth();

  if (!userId) {
    console.log('User is not authenticated');
    return null;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!prismaUser) {
    console.error('Prisma User not found for Clerk ID:', userId);
    return null;
  }

  const signedInUser: SignedInUser = {
    id: prismaUser.id.toString(),
    username: prismaUser.username || 'Unknown',
    role: prismaUser.role || null,
  };

  console.log(
    'Current Prisma username:',
    signedInUser.username,
    'Role:',
    signedInUser.role
  );

  return signedInUser;
}
