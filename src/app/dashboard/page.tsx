// This page component is responsible for rendering the dashboard page.
import { auth, currentUser } from '@clerk/nextjs';
import LoginModal from '@/components/LoginModal';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <LoginModal />;
  }

  // Extract the required fields and convert the user to a plain object
  const signedInUser = {
    id: user.id,
    username: user.username || 'Unknown',
  };

  return <DashboardClient signedInUser={signedInUser} />;
}
