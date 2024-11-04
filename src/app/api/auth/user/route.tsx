import { users } from '@clerk/clerk-sdk-node';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { handleUpsertUser } from '@/lib/services/userService';
import { UserSchema } from '@/schemas/userSchema';
import { UserData } from '@/types/user-types';
import { formatError, formatStringError } from '@/utils/errorUtils';
import { handleUnauthorizedHtml } from '@/utils/htmlTemplates';

function handleUsernameCheck(username: string): boolean {
  const allowedUsernames =
    process.env.ALLOWED_SIGNUP_USERNAMES?.split(',') || [];
  return allowedUsernames.includes(username);
}

async function deleteClerkUser(clerkId: string): Promise<void> {
  try {
    const user = await users.getUser(clerkId);
    if (user) {
      await users.deleteUser(clerkId);
    }
  } catch (error) {
    console.error('Error deleting user from Clerk:', error);
    throw error;
  }
}

export async function createAuthenticatedUser(): Promise<
  UserData | NextResponse
> {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      formatStringError('User ID is missing. Please sign in.'),
      {
        status: 401,
      }
    );
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      formatStringError(
        'User data could not be retrieved. Please try signing in again.'
      ),
      { status: 401 }
    );
  }

  if (!handleUsernameCheck(user.username || '')) {
    console.log('Unauthorized username detected. Returning HTML error page.');
    return new NextResponse(handleUnauthorizedHtml(), {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const userData: UserData = {
    clerkId: user.id,
    username: user.username ?? 'unknown',
    role: process.env.DEFAULT_USER_ROLE || 'TRAINER',
  };

  const parsedUser = UserSchema.safeParse(userData);

  if (!parsedUser.success) {
    return NextResponse.json(
      formatError('Invalid user data', ['user'], 'custom', true),
      {
        status: 400,
      }
    );
  }

  return parsedUser.data;
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

export async function POST(): Promise<NextResponse> {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is missing. Please sign in.' },
      { status: 401 }
    );
  }

  try {
    await deleteClerkUser(userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete unauthorized Clerk user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
