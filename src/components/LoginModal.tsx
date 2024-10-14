'use client';

import { useRouter } from 'next/navigation';
import { useDisclosure } from '@nextui-org/react';
import ReusableModal from '@/components/ReusableModal';

export default function LoginModal() {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const router = useRouter();

  const handleClose = () => {
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
