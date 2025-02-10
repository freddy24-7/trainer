import React from 'react';

import PlayerForm from '@/components/PlayerForm';
import { RenderPlayerFormWithWhatsAppLinkProps } from '@/types/user-types';
import { handleWhatsAppClick } from '@/utils/phoneNumberUtils';

export const RenderPlayerFormWithWhatsAppLink = ({
  formKey,
  initialData,
  playerData,
  onSubmit,
  onSubmissionStart,
  onAbort,
  submitButtonText,
  generateWhatsAppMessage,
  whatsappButtonText,
}: RenderPlayerFormWithWhatsAppLinkProps): React.ReactElement => {
  const effectiveWhatsappNumber = playerData?.whatsappNumber;

  return (
    <>
      <PlayerForm
        key={formKey}
        initialData={initialData}
        onSubmit={onSubmit}
        onSubmissionStart={onSubmissionStart ?? (() => {})}
        onAbort={onAbort ?? (() => {})}
        submitButtonText={submitButtonText}
      />
      {effectiveWhatsappNumber && (
        <a
          href={`https://wa.me/${effectiveWhatsappNumber.replace(/\D/g, '')}/?text=${encodeURIComponent(
            generateWhatsAppMessage(playerData, initialData)
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-green-500 text-white p-2 rounded-lg"
          onClick={() => handleWhatsAppClick()}
        >
          {whatsappButtonText}
        </a>
      )}
    </>
  );
};
