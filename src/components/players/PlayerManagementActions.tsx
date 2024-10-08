import React from 'react';

import { deletePlayer } from '@/app/actions/deletePlayer';
import { Player, PlayerManagementActions } from '@/types/types';

const confirmPlayerDeletion = (
  playerId: number,
  {
    setSubmitting,
    setPlayers,
    setModalBody,
    setIsModalOpen,
  }: {
    setSubmitting: (submitting: boolean) => void;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    setModalBody: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    setIsModalOpen: (isOpen: boolean) => void;
  }
): void => {
  setSubmitting(true);
  deletePlayer(playerId).then((response) => {
    if (response.success) {
      setModalBody(<p>Player deleted successfully!</p>);
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
    } else {
      setModalBody(<p className="text-red-500">{response.error}</p>);
    }
    setSubmitting(false);
    setIsModalOpen(false);
  });
};

const editPlayerDataHandler = (
  player: Player,
  {
    setEditPlayerData,
    setModalTitle,
    setIsModalOpen,
  }: {
    setEditPlayerData: React.Dispatch<React.SetStateAction<Player | null>>;
    setModalTitle: React.Dispatch<React.SetStateAction<string>>;
    setIsModalOpen: (isOpen: boolean) => void;
  }
): void => {
  setEditPlayerData(player);
  setModalTitle('Edit Player');
  setIsModalOpen(true);
};

const updatePlayerListAfterEdit = (
  updatedPlayer: Player,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setSubmitting: (submitting: boolean) => void
): void => {
  setPlayers((prevPlayers) =>
    prevPlayers.map((player) =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    )
  );
  setSubmitting(false);
};

const closeModalHandler = (
  setIsModalOpen: (isOpen: boolean) => void,
  setEditPlayerData: React.Dispatch<React.SetStateAction<Player | null>>
): void => {
  setIsModalOpen(false);
  setEditPlayerData(null);
};

const createHandleDeletePlayer = (
  actions: PlayerManagementActions
): ((playerId: number) => void) => {
  const {
    setPlayers,
    setSubmitting,
    setIsModalOpen,
    setModalBody,
    setModalTitle,
    setConfirmAction,
  } = actions;

  return (playerId: number): void => {
    setModalTitle('Confirm Deletion');
    setModalBody(
      <p>
        Are you sure you want to delete this player? Players with already
        registered data (minutes played) cannot be deleted.
      </p>
    );
    setConfirmAction(() =>
      confirmPlayerDeletion(playerId, {
        setSubmitting,
        setPlayers,
        setModalBody,
        setIsModalOpen,
      })
    );
    setIsModalOpen(true);
  };
};

const createHandleEditPlayer = (
  actions: PlayerManagementActions
): ((player: Player) => void) => {
  const { setEditPlayerData, setModalTitle, setIsModalOpen } = actions;

  return (player: Player): void => {
    editPlayerDataHandler(player, {
      setEditPlayerData,
      setModalTitle,
      setIsModalOpen,
    });
  };
};

const createHandlePlayerEdited = (
  actions: PlayerManagementActions
): ((updatedPlayer: Player) => void) => {
  const { setPlayers, setSubmitting } = actions;

  return (updatedPlayer: Player): void => {
    updatePlayerListAfterEdit(updatedPlayer, setPlayers, setSubmitting);
  };
};

const createHandleCloseModal = (
  actions: PlayerManagementActions
): (() => void) => {
  const { setIsModalOpen, setEditPlayerData } = actions;

  return (): void => {
    closeModalHandler(setIsModalOpen, setEditPlayerData);
  };
};

export const createPlayerManagementActions = (
  actions: PlayerManagementActions
): {
  handleDeletePlayer: (playerId: number) => void;
  handleEditPlayer: (player: Player) => void;
  handlePlayerEdited: (updatedPlayer: Player) => void;
  handleCloseModal: () => void;
} => {
  const handleDeletePlayer = createHandleDeletePlayer(actions);
  const handleEditPlayer = createHandleEditPlayer(actions);
  const handlePlayerEdited = createHandlePlayerEdited(actions);
  const handleCloseModal = createHandleCloseModal(actions);

  return {
    handleDeletePlayer,
    handleEditPlayer,
    handlePlayerEdited,
    handleCloseModal,
  };
};
