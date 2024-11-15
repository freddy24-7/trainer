import React from 'react';

import PlayerForm from '@/components/PlayerForm';
import { PlayerFormData } from '@/types/user-types';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';

interface RenderPlayerFormProps {
  formKey: number;
  initialUsername: string;
  initialWhatsappNumber: string;
  isSubmitting: boolean;
  playerData: PlayerFormData | null;
  handleEditPlayer: (data: PlayerFormData) => Promise<void>;
  onSubmissionStart?: () => void;
  onAbort?: () => void;
}

export const renderPlayerFormWithWhatsAppLink = ({
  formKey,
  initialUsername,
  initialWhatsappNumber,
  isSubmitting,
  playerData,
  handleEditPlayer,
  onSubmissionStart,
  onAbort,
}: RenderPlayerFormProps): React.ReactElement => {
  return (
    <>
      <PlayerForm
        key={formKey}
        initialData={{
          username: initialUsername,
          password: '',
          whatsappNumber: initialWhatsappNumber,
        }}
        onSubmit={handleEditPlayer}
        onSubmissionStart={() => {
          if (onSubmissionStart) {
            onSubmissionStart();
          }
        }}
        onAbort={() => {
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
    </>
  );
};
