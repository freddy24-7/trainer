import { redirect } from 'next/navigation';
import React from 'react';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { ProtectedLayoutProps } from '@/types/shared-types';

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
