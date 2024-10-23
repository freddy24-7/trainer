import { currentUser } from '@clerk/nextjs';
import React from 'react';

import { updateUsername } from '@/app/actions/updateUsername';
import Dashboard from '@/app/dashboard/Dashboard';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import LoginModal from '@/components/LoginModal';
import { SignedInUser, ClerkUser } from '@/types/user-types';

let lastCheckedUsername: string | null = null;

async function handleUpdateUsername(
  clerkUser: ClerkUser,
  signedInUser: SignedInUser
): Promise<boolean> {
  if (lastCheckedUsername === clerkUser.username) {
    console.log('Username check skipped as it matches the last checked value.');
    return false;
  }

  if (clerkUser.username === signedInUser.username) {
    console.log('Username is already up-to-date in the database.');
    lastCheckedUsername = clerkUser.username;
    return false;
  }

  try {
    const updateResponse = await updateUsername(
      clerkUser.id,
      clerkUser.username || 'Unknown'
    );

    if ('errors' in updateResponse) {
      console.error('Failed to update username:', updateResponse.errors);
      return false;
    } else {
      console.log('Username successfully updated!');
      lastCheckedUsername = clerkUser.username;
      return true;
    }
  } catch (error) {
    console.error('Error checking or updating username:', error);
    return false;
  }
}

export default async function DashboardPage(): Promise<React.ReactElement> {
  const clerkUser = (await currentUser()) as ClerkUser;

  if (!clerkUser) {
    return <LoginModal />;
  }

  let signedInUser: SignedInUser | null = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  console.log('Clerk username:', clerkUser.username);
  console.log('Prisma username:', signedInUser.username);

  const usernameUpdated = await handleUpdateUsername(clerkUser, signedInUser);

  if (usernameUpdated) {
    signedInUser = await fetchAndCheckUser();
  }

  if (!signedInUser) {
    return <LoginModal />;
  }

  return <Dashboard signedInUser={signedInUser} />;
}
