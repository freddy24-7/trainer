'use client';

import React, { useState } from 'react';
import PlayerForm from '../../components/PlayerForm';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { validatePlayerData } from '@/schemas/validation/createPlayerValidation';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';
import { ZodIssue } from 'zod';
import { PlayerFormData } from '@/types/type-list';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

function AddPlayerForm({
  action,
}: {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerFormData | null>(null);

  const handleAddPlayer = async (data: PlayerFormData) => {
    const resetSubmission = handleSubmissionState(
      setIsSubmitting,
      () => console.log('Submission started...'),
      () => setIsSubmitting(false)
    );

    await handlePlayerFormSubmit({
      data,
      setIsSubmitting,
      validationFunction: validatePlayerData,
      actionFunction: (formData) => action({}, formData),
      onSuccess: (playerData) => {
        setPlayerData(playerData);
        setFormKey((prevKey) => prevKey + 1);
      },
    });

    resetSubmission();
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Player Management</h3>
        </CardHeader>
        <CardBody>
          <PlayerForm
            key={formKey}
            initialData={{ username: '', password: '', whatsappNumber: '' }}
            onSubmit={handleAddPlayer}
            onSubmissionStart={() => console.log('Submission started...')}
            onAbort={() => setIsSubmitting(false)}
            submitButtonText={isSubmitting ? 'Submitting...' : 'Add Player'}
          />
          {playerData?.whatsappNumber && (
            <a
              href={`https://wa.me/${playerData.whatsappNumber.replace(/\D/g, '')}/?text=${encodeURIComponent(
                `Hello ${playerData.username}, your account has been created. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`
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

export { AddPlayerForm };
