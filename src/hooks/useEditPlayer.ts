import { useState } from 'react';
import { toast } from 'react-toastify';
import { ZodIssue } from 'zod';

import {
  PlayerData,
  UpdatedPlayer,
  UseEditPlayerProps,
  UseEditPlayerReturn,
} from '@/types/types';
import { formatForSaving } from '@/utils/phoneNumberUtils';

const createFormData = (
  data: PlayerData,
  formattedNumber: string
): FormData => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('whatsappNumber', formattedNumber);
  return formData;
};

const processResponse = ({
  response,
  data,
  playerId,
  formattedNumber,
  onPlayerEdited,
  setPlayerData,
}: {
  response: { errors: ZodIssue[]; success?: boolean };
  data: PlayerData;
  playerId: number;
  formattedNumber: string;
  onPlayerEdited: (updatedPlayer: UpdatedPlayer) => void;
  setPlayerData: (data: PlayerData | null) => void;
}): void => {
  if (response.success && response.errors.length === 0) {
    const updatedPlayer: UpdatedPlayer = {
      id: playerId,
      username: data.username,
      whatsappNumber: formattedNumber,
      whatsappLink: `https://wa.me/${formattedNumber.replace(/\D/g, '')}`,
    };

    setPlayerData({ ...data, whatsappNumber: formattedNumber });
    onPlayerEdited(updatedPlayer);
    toast.success('Player updated successfully!');
  } else {
    const errorMessages = response.errors
      .map((error) => error.message)
      .join(', ');
    toast.error(`Validation errors: ${errorMessages}`);
  }
};

export const useEditPlayer = ({
  playerId,
  action,
  onPlayerEdited,
}: UseEditPlayerProps): UseEditPlayerReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  const handleEditPlayer = async (data: PlayerData): Promise<void> => {
    setIsSubmitting(true);
    const formattedNumber = formatForSaving(data.whatsappNumber);
    const formData = createFormData(data, formattedNumber);

    try {
      const response = await action(playerId, formData);
      processResponse({
        response,
        data,
        playerId,
        formattedNumber,
        onPlayerEdited,
        setPlayerData,
      });
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    playerData,
    handleEditPlayer,
  };
};
