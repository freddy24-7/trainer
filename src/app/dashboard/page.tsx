import { currentUser } from '@clerk/nextjs';
import React from 'react';

import { updateUsername } from '@/app/actions/updateUsername';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import DashboardClient from '@/components/DashboardClient';
import LoginModal from '@/components/LoginModal';

let lastCheckedUsername: string | null = null;

export default async function DashboardPage(): Promise<React.ReactElement> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <LoginModal />;
  }

  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  console.log('Clerk username:', clerkUser.username);
  console.log('Prisma username:', signedInUser.username);

  if (lastCheckedUsername !== clerkUser.username) {
    try {
      if (clerkUser.username !== signedInUser.username) {
        const updateResponse = await updateUsername(
          clerkUser.id,
          clerkUser.username || 'Unknown'
        );

        if (!updateResponse.success) {
          console.error('Failed to update username:', updateResponse.error);
        } else {
          lastCheckedUsername = clerkUser.username;
        }
      } else {
        console.log('Username is already up-to-date in the database.');
        lastCheckedUsername = clerkUser.username;
      }
    } catch (error) {
      console.error('Error checking or updating username:', error);
    }
  } else {
    console.log('Username check skipped as it matches the last checked value.');
  }

  return <DashboardClient signedInUser={signedInUser} />;
}
