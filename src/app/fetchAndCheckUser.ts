import { auth } from '@clerk/nextjs';

import { getUserByField } from '@/lib/services/prismaGetUserService';
import { SignedInUser } from '@/type-list/types';

export async function fetchAndCheckUser(): Promise<SignedInUser | null> {
  const { userId } = auth();

  if (!userId) {
    console.log('User is not authenticated');
    return null;
  }

  const prismaUser = await getUserByField('clerkId', userId);

  if (!prismaUser) {
    console.error('Prisma User not found for Clerk ID:', userId);
    return null;
  }

  const signedInUser: SignedInUser = {
    id: prismaUser.id.toString(),
    username: prismaUser.username ?? 'Unknown',
    role: prismaUser.role ?? undefined,
  };

  console.log(
    'Current Prisma username:',
    signedInUser.username,
    'Role:',
    signedInUser.role
  );

  return signedInUser;
}
