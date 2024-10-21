'use client';

import React, { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { DashboardClientProps } from '@/types/user-types';

export default function Dashboard({
  signedInUser,
}: DashboardClientProps): React.ReactElement {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoadingSpinner label="Success" color="success" labelColor="success" />
    );
  }

  return (
    <div className="mt-5 text-center max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold">Hoi {signedInUser.username}!</h1>
    </div>
  );
}
