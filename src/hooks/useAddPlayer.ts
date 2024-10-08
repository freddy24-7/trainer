import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  PlayerActionFunction,
  UseAddPlayerReturn,
  PlayerData,
} from '@/types/types';
import { formatWhatsappNumber } from '@/utils/formatWhatsappNumber';

export const useAddPlayer = (
  action: PlayerActionFunction
): UseAddPlayerReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleAddPlayer = async (data: PlayerData): Promise<void> => {
    setIsSubmitting(true);

    const formattedNumber = formatWhatsappNumber(data.whatsappNumber);
    if (!formattedNumber) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('whatsappNumber', formattedNumber);

    try {
      const response = await action({}, formData);
      if (response.errors.length === 0) {
        setPlayerData({ ...data, whatsappNumber: formattedNumber });
        toast.success('Player added successfully!');
        setFormKey((prevKey) => prevKey + 1);
      } else {
        const errorMessages = response.errors
          .map((error) => error.message)
          .join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    playerData,
    formKey,
    handleAddPlayer,
    setIsSubmitting,
  };
};
