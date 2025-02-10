import { useDisclosure } from '@heroui/react';
import { useState } from 'react';

import { StrengthModalHook } from '@/types/hook-types';

export const useStrengthModal = (
  initialStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null = null
): StrengthModalHook => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmChange,
  } = useDisclosure();
  const [selectedStrength, setSelectedStrength] = useState<
    'STRONGER' | 'SIMILAR' | 'WEAKER' | null
  >(initialStrength);

  return {
    isOpen,
    onOpen,
    onOpenChange,
    isConfirmOpen,
    onConfirmOpen,
    onConfirmChange,
    selectedStrength,
    setSelectedStrength,
  };
};
