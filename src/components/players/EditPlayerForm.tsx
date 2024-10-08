import React from 'react';
import { ZodIssue } from 'zod';

import { useEditPlayer } from '@/hooks/useEditPlayer';
import { EditPlayerFormProps } from '@/types/types';
import { formatToDisplay } from '@/utils/phoneNumberUtils';

import PlayerForm from './PlayerForm';
import SuccessMessage from './SuccessMessage';
import WhatsappMessageLink from './WhatsappMessageLink';

type Props = EditPlayerFormProps & {
  action: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[]; success?: boolean }>;
  onCloseModal: () => void;
};

const EditPlayerForm: React.FC<Props> = ({
  playerId,
  initialUsername,
  initialWhatsappNumber,
  onPlayerEdited,
  onSubmissionStart,
  onAbort,
  action,
}) => {
  const { isSubmitting, playerData, handleEditPlayer } = useEditPlayer({
    playerId,
    action,
    onPlayerEdited,
  });

  return (
    <div>
      {!playerData ? (
        <PlayerForm
          initialData={{
            username: initialUsername,
            password: '',
            whatsappNumber: formatToDisplay(initialWhatsappNumber),
          }}
          onSubmit={async (data) => {
            onSubmissionStart();
            await handleEditPlayer(data);
          }}
          onSubmissionStart={onSubmissionStart}
          onAbort={onAbort}
          submitButtonText={isSubmitting ? 'Updating...' : 'Update Player'}
        />
      ) : (
        <div>
          <SuccessMessage message="Player updated successfully!" />
          <WhatsappMessageLink
            whatsappNumber={playerData.whatsappNumber}
            message={`Hello ${playerData.username}, your account has been updated. Username: ${playerData.username}, Password: ${playerData.password}. Please log in and change your password to your own.`}
          />
        </div>
      )}
    </div>
  );
};

export { EditPlayerForm };
