import { useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';

export interface StrengthModalHook {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  isConfirmOpen: boolean;
  onConfirmOpen: () => void;
  onConfirmChange: (isOpen: boolean) => void;
  selectedStrength: 'STRONGER' | 'SIMILAR' | 'WEAKER' | null;
  setSelectedStrength: React.Dispatch<
    React.SetStateAction<'STRONGER' | 'SIMILAR' | 'WEAKER' | null>
  >;
}

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
