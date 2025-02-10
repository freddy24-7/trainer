import React from 'react';

import { EditPlayerForm } from '@/components/helpers/playerHelpers/EditPlayerForm';
import ReusableModal from '@/components/ReusableModal';
import { confirmButtonLabel, cancelButtonLabel } from '@/strings/clientStrings';
import { PlayerModalProps } from '@/types/user-types';
import { handleSubmissionState } from '@/utils/submissionUtils';

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
  confirmLabel = confirmButtonLabel,
  cancelLabel = cancelButtonLabel,
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
