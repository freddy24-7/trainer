import { useState, ReactNode } from 'react';

import { Player, PlayerManagementState } from '@/types/types';

export const usePlayerManagementState = (
  initialPlayers: Player[]
): PlayerManagementState => {
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState<ReactNode>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [editPlayerData, setEditPlayerData] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  return {
    submitting,
    setSubmitting,
    isModalOpen,
    setIsModalOpen,
    modalTitle,
    setModalTitle,
    modalBody,
    setModalBody,
    confirmAction,
    setConfirmAction,
    editPlayerData,
    setEditPlayerData,
    players,
    setPlayers,
  };
};
