// This component performs RBAC (Role-Based Access Control) checks

import { redirect } from 'next/navigation';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole: string;
}

const ProtectedLayout = async ({
  children,
  requiredRole,
}: ProtectedLayoutProps) => {
  try {
    const user = await fetchAndCheckUser();

    if (!user || user.role !== requiredRole) {
      redirect('/dashboard');
    }

    return <>{children}</>;
  } catch (error) {
    redirect('/sign-in');
  }
};

export default ProtectedLayout;
