// This component is a client-side implementation of the Player Management feature.

'use client';

import React, { useState } from 'react';
import { deletePlayer } from '@/app/actions/deletePlayer'; // Server action for deletion
import { Spinner } from '@nextui-org/spinner';
import { Button, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import ReusableModal from '@/components/ReusableModal';
import EditPlayerForm from '@/components/EditPlayerForm';

interface Player {
  id: number;
  username: string;
}

interface PlayerManagementClientProps {
  players: Player[];
}

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
    setModalBody(<p>Are you sure you want to delete this player?</p>);
    setConfirmAction(() => async () => {
      setSubmitting(true);
      const response = await deletePlayer(playerId); // Trigger server action
      if (response.success) {
        setModalBody(<p>Player deleted successfully!</p>);
        window.location.reload(); // Refresh to get updated data from the server
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
    setModalTitle('Edit Player');
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

      <ul className="space-y-2">
        {players.map((player: Player) => (
          <Card key={player.id} className="max-w-md mx-auto mb-4">
            <CardHeader className="flex justify-between items-center">
              <span className="text-md">{player.username}</span>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex justify-end space-x-2">
                <Button
                  color="primary"
                  onClick={() => handleEditPlayer(player)}
                  className="text-sm px-2 py-1"
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDeletePlayer(player.id)}
                  className="text-sm px-2 py-1"
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </ul>

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
