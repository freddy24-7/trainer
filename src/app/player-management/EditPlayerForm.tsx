'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React, { useState } from 'react';
import { ZodIssue } from 'zod';

import PlayerForm from '@/components/PlayerForm';
import { handleValidateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
import { PlayerFormData } from '@/types/user-types';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';

interface EditPlayerFormProps {
  playerId: number;
  action: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
  initialUsername: string;
  initialWhatsappNumber: string;
  onPlayerEdited: (updatedPlayer: {
    id: number;
    username: string;
    whatsappNumber: string;
    whatsappLink: string;
  }) => void;
  onSubmissionStart?: () => void;
  onAbort?: () => void;
  onCloseModal: () => void;
}

function EditPlayerForm({
  playerId,
  initialUsername,
  initialWhatsappNumber,
  action,
  onPlayerEdited,
  onSubmissionStart,
  onAbort,
}: EditPlayerFormProps): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerFormData | null>(null);

  const handleEditPlayer = async (data: PlayerFormData): Promise<void> => {
    if (onSubmissionStart) {
      onSubmissionStart();
    }
    await handlePlayerFormSubmit({
      data,
      setIsSubmitting,
      validationFunction: handleValidateEditPlayerData,
      actionFunction: (formData) => action(playerId, formData),
      onSuccess: (playerData) => {
        setPlayerData(playerData);
        setFormKey((prevKey) => prevKey + 1);

        const updatedPlayer = {
          id: playerId,
          username: data.username,
          whatsappNumber: playerData.whatsappNumber,
          whatsappLink: `https://wa.me/${playerData.whatsappNumber.replace(/\D/g, '')}`,
        };
        onPlayerEdited(updatedPlayer);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Edit Player</h3>
        </CardHeader>
        <CardBody>
          <PlayerForm
            key={formKey}
            initialData={{
              username: initialUsername,
              password: '',
              whatsappNumber: initialWhatsappNumber,
            }}
            onSubmit={handleEditPlayer}
            onSubmissionStart={() => {
              setIsSubmitting(true);
              if (onSubmissionStart) {
                onSubmissionStart();
              }
            }}
            onAbort={() => {
              setIsSubmitting(false);
              if (onAbort) {
                onAbort();
              }
            }}
            submitButtonText={isSubmitting ? 'Updating...' : 'Update Player'}
          />
          {playerData?.whatsappNumber && (
            <a
              href={`https://wa.me/${playerData.whatsappNumber.replace(/\D/g, '')}/?text=${encodeURIComponent(
                `Hello ${playerData.username}, your account has been updated. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-green-500 text-white p-2 rounded-lg"
              onClick={() => handleWhatsAppClick()}
            >
              Send WhatsApp Message to Player
            </a>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export { EditPlayerForm };
