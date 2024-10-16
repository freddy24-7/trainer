'use client';

import { useEffect, useState } from 'react';
import { DashboardClientProps } from '@/types/type-list';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard({ signedInUser }: DashboardClientProps) {
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
