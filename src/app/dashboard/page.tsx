import React from 'react';

import Dashboard from '@/app/dashboard/Dashboard';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import LoginModal from '@/components/LoginModal';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  return (
    <>
      <Dashboard signedInUser={signedInUser} />
    </>
  );
}
