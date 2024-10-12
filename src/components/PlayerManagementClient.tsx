'use client';

import React, { useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import ReusableModal from '@/components/ReusableModal';
import { EditPlayerForm } from '@/components/EditPlayerForm';
import PlayersList from '@/components/PlayersList';
import { PlayerManagementClientProps, Player } from '@/lib/types';
import { handleDeletePlayer } from '@/components/helpers/deletePlayer';
import { setupModal } from '@/utils/modalUtils';
import { handleSubmissionState } from '@/utils/submissionUtils';

export default function PlayerManagementClient({
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
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
    );
    setSubmitting(false);
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
        <div className="flex justify-center my-4">
          <Spinner size="lg" color="success" />
        </div>
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
