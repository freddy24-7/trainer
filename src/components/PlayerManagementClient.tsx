'use client';

import React, { useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import ReusableModal from '@/components/ReusableModal';
import { EditPlayerForm } from '@/components/EditPlayerForm';
import PlayersList from '@/components/PlayersList';
import { PlayerManagementClientProps, Player } from '@/lib/types';

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

  const handleDeletePlayer = (playerId: number) => {
    setModalTitle('Confirm Deletion');
    setModalBody(
      <p>
        Are you sure you want to delete this player? Players with already
        registered data (minutes played) cannot be deleted.
      </p>
    );
    setConfirmAction(() => async () => {
      setSubmitting(true);
      const response = await deletePlayerAction(playerId);
      if (response.success) {
        setModalBody(<p>Player deleted successfully!</p>);
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== playerId)
        );
      } else {
        setModalBody(<p className="text-red-500">{response.errors}</p>);
      }
      setSubmitting(false);
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditPlayerData(player);
    setModalTitle('Edit Player');
    setIsModalOpen(true);
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
        onEdit={handleEditPlayer}
        onDelete={handleDeletePlayer}
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
              onSubmissionStart={() => setSubmitting(true)}
              onAbort={() => setSubmitting(false)}
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
