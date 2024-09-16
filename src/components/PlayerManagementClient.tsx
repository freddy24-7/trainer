// This component is a client-side implementation of the Player Management feature.

'use client';

import React, { useState } from 'react';
import { deletePlayer } from '@/app/actions/deletePlayer';
import { Spinner } from '@nextui-org/spinner';
import ReusableModal from '@/components/ReusableModal';
import EditPlayerForm from '@/components/EditPlayerForm';
import PlayersList from '@/components/PlayersList';
import { PlayerManagementClientProps, Player } from '@/lib/types';

export default function PlayerManagementClient({
  players,
}: PlayerManagementClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);

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
      const response = await deletePlayer(playerId);
      if (response.success) {
        setModalBody(<p>Player deleted successfully!</p>);
        window.location.reload();
      } else {
        setModalBody(<p className="text-red-500">{response.error}</p>);
      }
      setSubmitting(false);
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditPlayerData(player);
    setModalTitle(
      'You can only edit players who does not yet have match data.'
    );
    setIsModalOpen(true);
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
        onClose={() => {
          setIsModalOpen(false);
          setEditPlayerData(null);
        }}
        title={modalTitle}
        body={
          editPlayerData ? (
            <EditPlayerForm
              playerId={editPlayerData.id}
              initialUsername={editPlayerData.username}
              onPlayerEdited={() => window.location.reload()}
              onSubmissionStart={() => setSubmitting(true)}
              onAbort={() => setSubmitting(false)}
            />
          ) : (
            modalBody
          )
        }
        confirmAction={editPlayerData ? undefined : confirmAction}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        cancelAction={() => {
          setIsModalOpen(false);
          setEditPlayerData(null);
        }}
      />
    </div>
  );
}
