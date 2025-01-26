import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

import { updateUsername } from '@/app/actions/updateUsername';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import Dashboard from '@/components/helpers/dashboardHelpers/Dashboard';
import LoginModal from '@/components/LoginModal';
import {
  usernameUpdateFailed,
  errorCheckingOrUpdatingUsername,
  usernameSuccessfullyUpdated,
} from '@/strings/serverStrings';
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
      console.error(usernameUpdateFailed, updateResponse.errors);
      return false;
    } else {
      console.log(usernameSuccessfullyUpdated);
      lastCheckedUsername = clerkUser.username;
      return true;
    }
  } catch (error) {
    console.error(errorCheckingOrUpdatingUsername, error);
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
