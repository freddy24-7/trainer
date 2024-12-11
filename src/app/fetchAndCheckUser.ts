import { auth } from '@clerk/nextjs';

import prisma from '@/lib/prisma';
import {
  userNotAuthenticatedMessage,
  prismaUserNotFoundMessage,
  prismaUserLogMessage,
} from '@/strings/serverStrings';
import { SignedInUser } from '@/types/user-types';

export async function fetchAndCheckUser(): Promise<SignedInUser | null> {
  const { userId } = auth();

  if (!userId) {
    console.log(userNotAuthenticatedMessage);
    return null;
  }

  const prismaUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!prismaUser) {
    console.error(prismaUserNotFoundMessage, userId);
    return null;
  }

  const signedInUser: SignedInUser = {
    id: prismaUser.id,
    username: prismaUser.username || 'Unknown',
    role: prismaUser.role || null,
  };

  console.log(
    prismaUserLogMessage,
    signedInUser.username,
    'Role:',
    signedInUser.role
  );

  return signedInUser;
}
