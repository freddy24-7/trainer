// This component performs RBAC (Role-Based Access Control) checks

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { ReactNode } from 'react';

const prisma = new PrismaClient();

// Define the layout's props, including requiredRole
interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole: string;
}

const ProtectedLayout = async ({
  children,
  requiredRole,
}: ProtectedLayoutProps) => {
  // Getting the current user's ID from Clerk's auth module
  const { userId } = auth();

  // If no user is logged in, redirect to the sign-in page
  if (!userId) {
    redirect('/sign-in');
  }

  // Fetching the user's role from the database using Prisma
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // If the user does not exist or does not have the required role, redirecting to the dashboard
  if (!user || user.role !== requiredRole) {
    redirect('/dashboard'); // Unauthorized users are sent to the dashboard
  }

  // Rendering the protected content if the user has the required role
  return <>{children}</>;
};

export default ProtectedLayout;
