import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { handleUpsertUser } from '@/lib/services/userService';
import { UserSchema } from '@/schemas/userSchema';
import { UserData } from '@/types/user-types';

export async function createAuthenticatedUser(): Promise<
  UserData | NextResponse
> {
  const { userId } = auth();

  if (!userId) {
    return handleRedirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return handleRedirectToSignIn();
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

  return parsedUser.data;
}

function handleRedirectToSignIn(): NextResponse {
  return NextResponse.redirect('/sign-in');
}

export async function GET(): Promise<NextResponse> {
  const authenticatedUser = await createAuthenticatedUser();

  if (authenticatedUser instanceof NextResponse) {
    return authenticatedUser;
  }

  const dbResponse = await handleUpsertUser(authenticatedUser);
  if (dbResponse) {
    return dbResponse;
  }

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000/dashboard'
  );
}
