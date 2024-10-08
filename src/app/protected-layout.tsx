import { redirect } from 'next/navigation';
import React from 'react';

import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { ProtectedLayoutProps } from '@/types/types';

const ProtectedLayout = async ({
  children,
  requiredRole,
}: ProtectedLayoutProps): Promise<React.ReactElement> => {
  const user = await fetchAndCheckUser();

  if (!user || user.role !== requiredRole) {
    redirect('/dashboard');
  }

  return <>{children}</>;
};

export default ProtectedLayout;
