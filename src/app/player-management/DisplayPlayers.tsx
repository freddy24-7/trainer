'use client';

import React, { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReusableModal from '@/components/ReusableModal';
import { EditPlayerForm } from '@/app/player-management/EditPlayerForm';
import PlayersList from '@/components/PlayersList';
import { PlayerManagementClientProps, Player } from '@/types/type-list';
import { handleDeletePlayer } from '@/components/helpers/DeletePlayer';
import { setupModal } from '@/utils/modalUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';
import { updatePlayerList } from '@/utils/playerUtils';

export default function DisplayPlayers({
  players: initialPlayers,
  editPlayerAction,
  deletePlayerAction,
}: PlayerManagementClientProps & {
  editPlayerAction: any;
  deletePlayerAction: any;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handleDeletePlayerClick = async (playerId: number) => {
    await handleDeletePlayer({
      playerId,
      setModalTitle,
      setModalBody,
      setConfirmAction,
      setSubmitting,
      setPlayers,
      deletePlayerAction,
      setIsModalOpen,
    });
  };

  const handleEditPlayerClick = (player: Player) => {
    setEditPlayerData(player);
    setupModal({
      setModalTitle,
      setModalBody,
      setConfirmAction,
      setIsModalOpen,
      title: 'Edit Player',
      body: null,
      confirmAction: () => {},
    });
  };

  const handlePlayerEdited = (updatedPlayer: Player) => {
    updatePlayerList(updatedPlayer, setPlayers, setSubmitting);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditPlayerData(null);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-black">
        Current Players
      </h3>

      {submitting && (
        <LoadingSpinner
          label="Submitting..."
          color="success"
          labelColor="success"
        />
      )}

      <PlayersList
        players={players}
        onEdit={handleEditPlayerClick}
        onDelete={handleDeletePlayerClick}
      />

      <ReusableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
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
    </div>
  );
}
