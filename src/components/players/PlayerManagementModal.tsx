import React from 'react';

import { EditPlayerForm } from '@/components/players/EditPlayerForm';
import ReusableModal from '@/components/ReusableModal';
import { EditPlayerResponse, Player } from '@/types/types';

interface PlayerManagementModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  modalTitle: string;
  modalBody: React.ReactNode;
  editPlayerData: Player | null;
  handlePlayerEdited: (updatedPlayer: Player) => void;
  setSubmitting: (submitting: boolean) => void;
  editPlayer: (
    playerId: number,
    params: FormData
  ) => Promise<EditPlayerResponse>;
  confirmAction: (() => void) | undefined;
}

export default function PlayerManagementModal({
  isModalOpen,
  handleCloseModal,
  modalTitle,
  modalBody,
  editPlayerData,
  handlePlayerEdited,
  setSubmitting,
  editPlayer,
  confirmAction,
}: PlayerManagementModalProps): React.ReactElement {
  return (
    <ReusableModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={modalTitle}
      body={
        editPlayerData ? (
          <EditPlayerForm
            playerId={editPlayerData.id}
            initialUsername={editPlayerData.username ?? ''}
            initialWhatsappNumber={editPlayerData.whatsappNumber ?? ''}
            onPlayerEdited={handlePlayerEdited}
            onSubmissionStart={() => setSubmitting(true)}
            onAbort={() => setSubmitting(false)}
            action={editPlayer}
            onCloseModal={handleCloseModal}
          />
        ) : (
          modalBody
        )
      }
      confirmAction={editPlayerData ? undefined : confirmAction}
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      cancelAction={handleCloseModal}
    />
  );
}
