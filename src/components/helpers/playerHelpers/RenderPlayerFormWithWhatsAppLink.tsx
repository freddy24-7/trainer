import React from 'react';

import PlayerForm from '@/components/PlayerForm';
import {
  updatingButtonText,
  updatePlayerButtonText,
  sendWhatsAppMessageText,
} from '@/strings/clientStrings';
import { RenderPlayerFormProps } from '@/types/user-types';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';

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
        submitButtonText={
          isSubmitting ? updatingButtonText : updatePlayerButtonText
        }
      />
      {(playerData?.whatsappNumber || initialWhatsappNumber) && (
        <a
          href={`https://wa.me/${(playerData?.whatsappNumber || initialWhatsappNumber || '').replace(/\D/g, '')}/?text=${encodeURIComponent(
            `Hello ${playerData?.username || initialUsername}, your account has been updated. Username: ${playerData?.username || initialUsername}, Password: ${playerData?.password}. Please log in and change your password to your own.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-green-500 text-white p-2 rounded-lg"
          onClick={() => handleWhatsAppClick()}
        >
          {sendWhatsAppMessageText}
        </a>
      )}
    </>
  );
};
