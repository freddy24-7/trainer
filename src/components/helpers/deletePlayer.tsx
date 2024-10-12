import React from 'react';
import { Player } from '@/lib/types';

export const handleDeletePlayer = async ({
  playerId,
  setModalTitle,
  setModalBody,
  setConfirmAction,
  setSubmitting,
  setPlayers,
  deletePlayerAction,
  setIsModalOpen,
}: {
  playerId: number;
  setModalTitle: (title: string) => void;
  setModalBody: (body: React.ReactNode) => void;
  setConfirmAction: (action: () => void) => void;
  setSubmitting: (submitting: boolean) => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  deletePlayerAction: (
    playerId: number
  ) => Promise<{ success: boolean; errors?: string }>;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
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
