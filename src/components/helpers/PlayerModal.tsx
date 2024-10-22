import React from 'react';
import { ZodIssue } from 'zod';

import { EditPlayerForm } from '@/app/player-management/EditPlayerForm';
import ReusableModal from '@/components/ReusableModal';
import { Player } from '@/types/user-types';
import { handleSubmissionState } from '@/utils/submissionUtils';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  modalBody: React.ReactNode;
  editPlayerData: Player | null;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlayerEdited: (updatedPlayer: Player) => void;
  editPlayerAction: (
    playerId: number,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
  confirmAction?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  cancelAction?: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  modalTitle,
  modalBody,
  editPlayerData,
  setSubmitting,
  handlePlayerEdited,
  editPlayerAction,
  confirmAction,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  cancelAction,
}) => {
  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      body={
        editPlayerData ? (
          <EditPlayerForm
            playerId={editPlayerData.id}
            initialUsername={editPlayerData.username}
            initialWhatsappNumber={editPlayerData.whatsappNumber}
            onPlayerEdited={handlePlayerEdited}
            onSubmissionStart={() => handleSubmissionState(setSubmitting)}
            onAbort={() =>
              handleSubmissionState(setSubmitting, undefined, () =>
                setSubmitting(false)
              )
            }
            action={editPlayerAction}
            onCloseModal={onClose}
          />
        ) : (
          modalBody
        )
      }
      confirmAction={editPlayerData ? undefined : confirmAction}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      cancelAction={cancelAction || onClose}
    />
  );
};

export default PlayerModal;
