//This page handles the dashboard page. It checks if the user is logged in and displays a welcome message.

import { auth, currentUser } from '@clerk/nextjs';

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Please log in.</div>;
  }

  // Extract the required fields and convert the user to a plain object
  const signedInUser = {
    id: user.id,
    username: user.username || 'Unknown',
  };

  return (
    <div className="mt-5 text-center max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold">Hoi {signedInUser.username}!</h1>
    </div>
  );
}
