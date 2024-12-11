import React from 'react';

import {
  editPlayerTitle,
  confirmDeletionTitle,
  confirmDeletionMessage,
  playerDeletedTitle,
  playerDeletedMessage,
  errorTitle,
  errorDeletingPlayerMessage,
} from '@/strings/clientStrings';
import { ModalSetupParams } from '@/types/shared-types';
import { Player } from '@/types/user-types';

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
    title: editPlayerTitle,
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

  setModalTitle(confirmDeletionTitle);
  setModalBody(<p>{confirmDeletionMessage}</p>);

  setConfirmAction(() => async () => {
    const result = await deletePlayerAction(playerId);

    if (result.success) {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
      setModalTitle(playerDeletedTitle);
      setModalBody(<p>{playerDeletedMessage}</p>);

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } else {
      setModalTitle(errorTitle);
      setModalBody(<p>{result.errors || errorDeletingPlayerMessage}</p>);
    }

    setConfirmAction(() => {});
    setIsModalOpen(true);
  });

  setIsModalOpen(true);
};
