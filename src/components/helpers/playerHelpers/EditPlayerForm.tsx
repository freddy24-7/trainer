import { Card, CardHeader, CardBody } from '@heroui/react';
import React, { useState } from 'react';

import { RenderPlayerFormWithWhatsAppLink } from '@/components/helpers/playerHelpers/RenderPlayerFormWithWhatsAppLink';
import { handleValidateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
import {
  editPlayerHeader,
  updatingButtonText,
  updatePlayerButtonText,
  sendWhatsAppMessageText,
} from '@/strings/clientStrings';
import { PlayerFormData, EditPlayerFormProps } from '@/types/user-types';
import { handlePlayerFormSubmit } from '@/utils/playerFormUtils';

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
    if (onSubmissionStart) onSubmissionStart();
    await handlePlayerFormSubmit({
      data,
      setIsSubmitting,
      validationFunction: handleValidateEditPlayerData,
      actionFunction: (formData) => action(playerId, formData),
      onSuccess: (playerData) => {
        setPlayerData(playerData);
        setFormKey((prevKey) => prevKey + 1);
        onPlayerEdited({
          id: playerId,
          username: data.username,
          whatsappNumber: data.whatsappNumber,
          whatsappLink: data.whatsappNumber
            ? `https://wa.me/${data.whatsappNumber.replace(/\D/g, '')}`
            : '',
        });
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{editPlayerHeader}</h3>
        </CardHeader>
        <CardBody>
          <RenderPlayerFormWithWhatsAppLink
            formKey={formKey}
            initialData={{
              username: initialUsername,
              password: '',
              whatsappNumber: initialWhatsappNumber || '',
            }}
            isSubmitting={isSubmitting}
            playerData={playerData}
            onSubmit={handleEditPlayer}
            onSubmissionStart={onSubmissionStart}
            onAbort={onAbort}
            submitButtonText={
              isSubmitting ? updatingButtonText : updatePlayerButtonText
            }
            generateWhatsAppMessage={(data, initData) =>
              `Hello ${data?.username || initData.username}, your account has been updated. Username: ${
                data?.username || initData.username
              }, Password: ${data?.password}. Please log in and change your password.`
            }
            whatsappButtonText={sendWhatsAppMessageText}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export { EditPlayerForm };
