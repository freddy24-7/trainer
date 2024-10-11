'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { DashboardClientProps } from '@/lib/types';

export default function DashboardClient({
  signedInUser,
}: DashboardClientProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner label="Success" color="success" labelColor="success" />
      </div>
    );
  }

  return (
    <div className="mt-5 text-center max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold">Hoi {signedInUser.username}!</h1>
    </div>
  );
}
