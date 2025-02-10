'use client';

import { Card, CardHeader, CardBody } from '@heroui/react';
import React, { useState } from 'react';
import { ZodIssue } from 'zod';

import { RenderPlayerFormWithWhatsAppLink } from '@/components/helpers/playerHelpers/RenderPlayerFormWithWhatsAppLink';
import { handleValidatePlayerData } from '@/schemas/validation/createPlayerValidation';
import {
  playerAdditionTitle,
  submittingText,
  addPlayerButtonText,
  sendWhatsAppMessage,
} from '@/strings/clientStrings';
import { PlayerFormData } from '@/types/user-types';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';

function AddPlayerForm({
  action,
}: {
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerFormData | null>(null);

  const handleAddPlayer = async (data: PlayerFormData): Promise<void> => {
    await handlePlayerFormSubmit({
      data,
      setIsSubmitting,
      validationFunction: handleValidatePlayerData,
      actionFunction: (formData) => action({}, formData),
      onSuccess: (playerData) => {
        setPlayerData(playerData);
        setFormKey((prevKey) => prevKey + 1);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{playerAdditionTitle}</h3>
        </CardHeader>
        <CardBody>
          <RenderPlayerFormWithWhatsAppLink
            formKey={formKey}
            initialData={{ username: '', password: '', whatsappNumber: '' }}
            isSubmitting={isSubmitting}
            playerData={playerData}
            onSubmit={handleAddPlayer}
            onSubmissionStart={() => console.log('Submission started...')}
            onAbort={() => setIsSubmitting(false)}
            submitButtonText={
              isSubmitting ? submittingText : addPlayerButtonText
            }
            generateWhatsAppMessage={(data, initData) =>
              `Hallo ${data?.username || initData.username}, je account is aangemaakt. Gebruikersnaam: ${
                data?.username || initData.username
              }, Wachtwoord: ${data?.password}. Log alstublieft in en wijzig je wachtwoord.`
            }
            whatsappButtonText={sendWhatsAppMessage}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export { AddPlayerForm };
