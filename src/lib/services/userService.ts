import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { UserData } from '@/types/user-types';

export async function handleUpsertUser(
  userData: UserData
): Promise<NextResponse | null> {
  try {
    const prismaUserData = {
      ...userData,
      role: userData.role as Role,
    };

    await prisma.user.upsert({
      where: { clerkId: userData.clerkId },
      update: {},
      create: prismaUserData,
    });
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error interacting with the database:', error.message);
      return NextResponse.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unexpected error', error);
      return NextResponse.json(
        { error: 'Unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
