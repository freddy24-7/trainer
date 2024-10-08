import { Spinner } from '@nextui-org/spinner';
import React from 'react';

import PlayerManagementModal from '@/components/players/PlayerManagementModal';
import PlayersList from '@/components/players/PlayersList';
import { Player, EditPlayerResponse } from '@/types/types';

export const RenderPlayersList = ({
  submitting,
  players,
  handleEditPlayer,
  handleDeletePlayer,
}: {
  submitting: boolean;
  players: Player[];
  handleEditPlayer: (player: Player) => void;
  handleDeletePlayer: (playerId: number) => void;
}): React.ReactNode => {
  return (
    <>
      {submitting && (
        <div className="flex justify-center my-4">
          <Spinner size="lg" color="success" />
        </div>
      )}
      <PlayersList
        players={players}
        onEdit={handleEditPlayer}
        onDelete={handleDeletePlayer}
      />
    </>
  );
};

export const RenderPlayerManagementModal = ({
  isModalOpen,
  handleCloseModal,
  modalTitle,
  modalBody,
  editPlayerData,
  handlePlayerEdited,
  setSubmitting,
  editPlayer,
  confirmAction,
}: {
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
}): React.ReactNode => {
  return (
    <PlayerManagementModal
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      modalTitle={modalTitle}
      modalBody={modalBody}
      editPlayerData={editPlayerData}
      handlePlayerEdited={handlePlayerEdited}
      setSubmitting={setSubmitting}
      editPlayer={editPlayer}
      confirmAction={confirmAction}
    />
  );
};
