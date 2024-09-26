// This component is responsible for rendering a form to edit a player.

'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PlayerForm from './PlayerForm';
import { ZodIssue } from 'zod';
import { EditPlayerFormProps } from '@/lib/types';

type Props = EditPlayerFormProps & {
  action: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[]; success?: boolean }>;
  onCloseModal: () => void;
};

function EditPlayerForm({
  playerId,
  initialUsername,
  initialWhatsappNumber,
  onPlayerEdited,
  onSubmissionStart,
  onAbort,
  action,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerData, setPlayerData] = useState<{
    username: string;
    password: string;
    whatsappNumber: string;
  } | null>(null);

  const formatToDisplay = (number: string) => {
    if (number.startsWith('+316')) {
      return number.replace('+316', '06');
    }
    return number;
  };

  const formatForSaving = (number: string) => {
    if (number.startsWith('06')) {
      return number.replace('06', '+316');
    }
    return number;
  };

  const handleEditPlayer = async (data: {
    username: string;
    password: string;
    whatsappNumber: string;
  }) => {
    setIsSubmitting(true);
    onSubmissionStart();

    const formattedNumber = formatForSaving(data.whatsappNumber);

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('whatsappNumber', formattedNumber);

    try {
      const response = await action(playerId, formData);
      if (response.errors.length === 0) {
        const updatedPlayer = {
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
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!playerData ? (
        <PlayerForm
          initialData={{
            username: initialUsername,
            password: '',
            whatsappNumber: formatToDisplay(initialWhatsappNumber),
          }}
          onSubmit={handleEditPlayer}
          onSubmissionStart={onSubmissionStart}
          onAbort={onAbort}
          submitButtonText={isSubmitting ? 'Updating...' : 'Update Player'}
        />
      ) : (
        <div>
          <p className="text-green-600">Player updated successfully!</p>
          <a
            href={`https://wa.me/${playerData.whatsappNumber.replace(
              /\D/g,
              ''
            )}/?text=${encodeURIComponent(
              `Hello ${playerData.username}, your account has been updated. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-green-500 text-white p-2 rounded-lg inline-block"
          >
            Send WhatsApp Message to Player
          </a>
        </div>
      )}
    </div>
  );
}

export { EditPlayerForm };
