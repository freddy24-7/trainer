'use client';

import { useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ReusableModal from '@/components/ReusableModal';
import {
  loginRequiredTitle,
  loginRequiredBody,
  closeButtonLabel,
} from '@/strings/clientStrings';

export default function LoginModal(): React.ReactElement {
  const { isOpen, onOpenChange } = useDisclosure({ defaultOpen: true });
  const router = useRouter();

  const handleClose = (): void => {
    router.push('/');
    return;
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onOpenChange}
      title={loginRequiredTitle}
      body={<p>{loginRequiredBody}</p>}
      cancelLabel={closeButtonLabel}
      cancelAction={handleClose}
    />
  );
}
