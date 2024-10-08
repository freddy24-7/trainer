'use client';

import React from 'react';

import {
  RenderPlayersList,
  RenderPlayerManagementModal,
} from '@/components/players/PlayerManagementClientHelpers';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { PlayerManagementClientProps } from '@/types/types';

export default function PlayerManagementClient({
  players: initialPlayers,
}: PlayerManagementClientProps): React.ReactNode {
  const {
    submitting,
    isModalOpen,
    modalTitle,
    modalBody,
    confirmAction,
    editPlayerData,
    players,
    handleDeletePlayer,
    handleEditPlayer,
    handlePlayerEdited,
    handleCloseModal,
    setSubmitting,
    editPlayer,
  } = usePlayerManagement(initialPlayers);

  return (
    <div>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-black">
        Current Players
      </h3>

      <RenderPlayersList
        submitting={submitting}
        players={players}
        handleEditPlayer={handleEditPlayer}
        handleDeletePlayer={handleDeletePlayer}
      />

      <RenderPlayerManagementModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
        editPlayerData={editPlayerData}
        handlePlayerEdited={handlePlayerEdited}
        setSubmitting={setSubmitting}
        editPlayer={editPlayer}
        confirmAction={confirmAction}
      />
    </div>
  );
}
