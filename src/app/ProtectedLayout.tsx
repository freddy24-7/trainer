import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';

interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole: string;
}

const ProtectedLayout = async ({
  children,
  requiredRole,
}: ProtectedLayoutProps): Promise<React.ReactElement> => {
  try {
    const user = await fetchAndCheckUser();

    if (!user || user.role !== requiredRole) {
      redirect('/dashboard');
    }

    return <>{children}</>;
  } catch (error) {
    console.error(error);
    redirect('/sign-in');
  }
};

export default ProtectedLayout;
