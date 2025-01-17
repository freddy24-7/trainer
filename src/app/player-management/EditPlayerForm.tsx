import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React, { useState } from 'react';

import { renderPlayerFormWithWhatsAppLink } from '@/components/helpers/playerHelpers/RenderPlayerFormWithWhatsAppLink';
import { handleValidateEditPlayerData } from '@/schemas/validation/editPlayerValidation';
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
          {renderPlayerFormWithWhatsAppLink({
            formKey,
            initialUsername,
            initialWhatsappNumber,
            isSubmitting,
            playerData,
            handleEditPlayer,
            onSubmissionStart,
            onAbort,
          })}
        </CardBody>
      </Card>
    </div>
  );
}

export { EditPlayerForm };
