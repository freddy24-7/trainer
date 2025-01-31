import { redirect } from 'next/navigation';
import React from 'react';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { ProtectedLayoutProps } from '@/types/shared-types';

const ProtectedLayout = async ({
  children,
  requiredRole,
}: ProtectedLayoutProps): Promise<React.ReactElement> => {
  let redirectPath: string | null = null;

  try {
    const user = await fetchAndCheckUser();

    if (!user || user.role !== requiredRole) {
      redirectPath = '/dashboard';
    }
  } catch (error) {
    console.error(error);
    redirectPath = '/sign-in';
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  return <>{children}</>;
};

export default ProtectedLayout;
