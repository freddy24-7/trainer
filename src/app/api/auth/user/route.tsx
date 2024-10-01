import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { UserSchema } from '@/schemas/userSchema';
import { UserData } from '@/lib/types';

function redirectToSignIn(): NextResponse {
  return NextResponse.redirect('/sign-in');
}

export async function GET(): Promise<NextResponse> {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const userData: UserData = {
    clerkId: user.id,
    username: user.username ?? 'unknown',
    role: process.env.DEFAULT_USER_ROLE || 'TRAINER',
  };

  const parsedUser = UserSchema.safeParse(userData);

  if (!parsedUser.success) {
    return NextResponse.json(
      { error: 'Invalid user data', details: parsedUser.error.format() },
      { status: 400 }
    );
  }

  try {
    await prisma.user.upsert({
      where: { clerkId: parsedUser.data.clerkId },
      update: {},
      create: parsedUser.data,
    });
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

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000/dashboard'
  );
}
