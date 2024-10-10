import { users } from '@clerk/clerk-sdk-node';

import { CreateClerkUserResult } from '@/type-list/types';

interface ClerkUserData {
  username: string;
  password?: string;
}

const unknownErrorMessage = 'Unknown error occurred';

export async function createUserInClerk(
  userData: ClerkUserData
): Promise<CreateClerkUserResult> {
  try {
    const clerkUser = await users.createUser({
      username: userData.username,
      password: userData.password,
    });
    return { clerkUser, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      clerkUser: null,
      error: `Error creating user in Clerk: ${errorMessage}`,
    };
  }
}

export async function updateUserInClerk(
  clerkId: string,
  userData: ClerkUserData
): Promise<void> {
  try {
    await users.updateUser(clerkId, {
      username: userData.username,
      password: userData.password || undefined,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : unknownErrorMessage;
    throw new Error(`Error updating user in Clerk: ${errorMessage}`);
  }
}

export async function deleteUser(clerkId: string): Promise<void> {
  try {
    await users.deleteUser(clerkId);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : unknownErrorMessage;
    throw new Error(`Error deleting user in Clerk: ${errorMessage}`);
  }
}
