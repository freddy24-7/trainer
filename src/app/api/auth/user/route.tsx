import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { UserSchema } from '@/schemas/userSchema';
import {
  invalidUserData,
  errorInteractingWithDatabase,
} from '@/strings/serverStrings';

export async function GET(): Promise<NextResponse> {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect('/sign-in');
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect('/sign-in');
  }

  const userData = {
    clerkId: user.id,
    username: user.username,
    role: 'TRAINER',
  };

  console.log('Validating user data with Zod:', userData);

  const parsedUser = UserSchema.safeParse(userData);

  if (!parsedUser.success) {
    console.error(parsedUser.error.format());
    return NextResponse.json(
      { error: invalidUserData, details: parsedUser.error.format() },
      { status: 400 }
    );
  }

  try {
    let alreadyExistingUser = await prisma.user.findUnique({
      where: { clerkId: parsedUser.data.clerkId },
    });

    if (!alreadyExistingUser) {
      await prisma.user.create({
        data: parsedUser.data,
      });
    }
  } catch (error) {
    console.error(errorInteractingWithDatabase, error);
  } finally {
    await prisma.$disconnect();
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: 'http://localhost:3000/dashboard',
    },
  });
}
