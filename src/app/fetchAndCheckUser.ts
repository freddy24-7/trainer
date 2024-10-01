// This is a reusable function that fetches the current user's data

import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function fetchAndCheckUser() {
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

  const signedInUser = {
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
