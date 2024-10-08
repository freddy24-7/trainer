'use client';

import { useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ReusableModal from '@/components/ReusableModal';

export default function LoginModal(): React.ReactElement {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const router = useRouter();

  const handleClose = (): void => {
    router.push('/');
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onOpenChange}
      title="Log In Required"
      body={<p>You need to be logged in to access the dashboard.</p>}
      cancelLabel="Close"
      cancelAction={handleClose}
    />
  );
}
