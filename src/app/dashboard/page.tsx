// This server component is responsible for rendering the dashboard page.

import { auth, currentUser } from '@clerk/nextjs';
import LoginModal from '@/components/LoginModal';
import DashboardClient from '@/components/DashboardClient';
import { updateUsername } from '@/app/actions/updateUsername';

// Tracking the last checked username globally within the session
let lastCheckedUsername: string | null = null;

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <LoginModal />;
  }

  // Extracting the required fields and convert the user to a plain object
  const signedInUser = {
    id: user.id,
    username: user.username || 'Unknown',
  };

  console.log('Current Clerk username:', signedInUser.username);

  // Updating if the username has changed since the last check
  if (lastCheckedUsername !== signedInUser.username) {
    try {
      const updateResponse = await updateUsername(
        signedInUser.id,
        signedInUser.username
      );

      if (!updateResponse.success) {
        console.error('Failed to update username:', updateResponse.error);
      } else {
        lastCheckedUsername = signedInUser.username;
      }
    } catch (error) {
      console.error('Error checking or updating username:', error);
    }
  } else {
    console.log('Username check skipped as it matches the last checked value.');
  }

  return <DashboardClient signedInUser={signedInUser} />;
}
