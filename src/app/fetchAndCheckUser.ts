// This is a reusable function that fetches the current user's data

import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function fetchAndCheckUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const prismaUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!prismaUser) {
    console.error('Prisma User not found for Clerk ID:', userId);
    return null;
  }

  const userRole = prismaUser.role || null;

  const signedInUser = {
    id: prismaUser.id.toString(),
    username: prismaUser.username || 'Unknown',
    role: userRole,
  };

  console.log(
    'Current Prisma username:',
    signedInUser.username,
    'Role:',
    signedInUser.role
  );

  return signedInUser;
}
