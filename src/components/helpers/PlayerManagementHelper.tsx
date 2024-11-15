import React from 'react';

import { Player } from '@/types/user-types';

interface ModalSetupParams {
  setModalTitle: React.Dispatch<React.SetStateAction<string>>;
  setModalBody: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleEditPlayer = (
  setupModal: ({
    setModalTitle,
    setModalBody,
    setConfirmAction,
    setIsModalOpen,
    title,
    body,
    confirmAction,
  }: {
    setModalTitle: React.Dispatch<React.SetStateAction<string>>;
    setModalBody: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    setConfirmAction: React.Dispatch<React.SetStateAction<() => void>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    body: React.ReactNode;
    confirmAction: () => void;
  }) => void,
  modalSetters: ModalSetupParams
): void => {
  const { setModalTitle, setModalBody, setConfirmAction, setIsModalOpen } =
    modalSetters;

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

export const handleDeletePlayer = async (
  playerId: number,
  deletePlayerAction: (
    playerId: number
  ) => Promise<{ success: boolean; errors?: string }>,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  modalSetters: ModalSetupParams
): Promise<void> => {
  const { setModalTitle, setModalBody, setConfirmAction, setIsModalOpen } =
    modalSetters;

  setModalTitle('Confirm Deletion');
  setModalBody(
    <p>
      Are you sure you want to delete this player? Players with already
      registered data (minutes played) cannot be deleted.
    </p>
  );

  setConfirmAction(() => async () => {
    const result = await deletePlayerAction(playerId);

    if (result.success) {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
      setModalTitle('Player Deleted');
      setModalBody(<p>The player was successfully deleted.</p>);

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } else {
      setModalTitle('Error');
      setModalBody(
        <p>{result.errors || 'An error occurred while deleting the player.'}</p>
      );
    }

    setConfirmAction(() => {});
    setIsModalOpen(true);
  });

  setIsModalOpen(true);
};
