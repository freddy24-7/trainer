'use client';

import React, { useState } from 'react';

import {
  handleEditPlayer,
  handleDeletePlayer,
} from '@/components/helpers/playerHelpers/PlayerManagementHelper';
import PlayerModal from '@/components/helpers/playerHelpers/PlayerModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlayersList from '@/components/PlayersList';
import { currentPlayersHeader, submittingLabel } from '@/strings/clientStrings';
import { Player, DisplayPlayersProps } from '@/types/user-types';
import { setupModal } from '@/utils/modalUtils';
import { updatePlayerList } from '@/utils/playerUtils';

function DisplayPlayers({
  players: initialPlayers,
  editPlayerAction,
  deletePlayerAction,
}: DisplayPlayersProps): React.ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const modalSetters = {
    setModalTitle,
    setModalBody,
    setConfirmAction,
    setIsModalOpen,
  };

  const handleDeletePlayerClick = async (playerId: number): Promise<void> => {
    await handleDeletePlayer(
      playerId,
      deletePlayerAction,
      setPlayers,
      modalSetters
    );
  };

  const handleEditPlayerClick = (player: Player): void => {
    setEditPlayerData(player);
    handleEditPlayer(setupModal, modalSetters);
  };

  const handlePlayerEdited = (updatedPlayer: Player): void => {
    updatePlayerList(updatedPlayer, setPlayers, setSubmitting);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditPlayerData(null);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-black">
        {currentPlayersHeader}
      </h3>

      {submitting && (
        <LoadingSpinner
          label={submittingLabel}
          color="success"
          labelColor="success"
        />
      )}

      <PlayersList
        players={players}
        onEdit={handleEditPlayerClick}
        showGroupChatOption={false}
        onDelete={handleDeletePlayerClick}
      />

      <PlayerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
        editPlayerData={editPlayerData}
        setSubmitting={setSubmitting}
        handlePlayerEdited={handlePlayerEdited}
        editPlayerAction={editPlayerAction}
        confirmAction={confirmAction}
      />
    </div>
  );
}

export { DisplayPlayers };
