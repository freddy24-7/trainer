import { createPlayerManagementActions } from '@/components/players/PlayerManagementActions';
import { usePlayerManagementState } from '@/hooks/usePlayerManagementState';
import {
  Player,
  EditPlayerResponse,
  PlayerManagementReturn,
} from '@/types/types';
import { editPlayerHelper } from '@/utils/editPlayerHelper';

export const usePlayerManagement = (
  initialPlayers: Player[]
): PlayerManagementReturn => {
  const {
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
  } = usePlayerManagementState(initialPlayers);

  const actions = {
    setPlayers,
    setSubmitting,
    setIsModalOpen,
    setModalBody,
    setModalTitle,
    setConfirmAction,
    setEditPlayerData,
  };

  const handlers = createPlayerManagementActions(actions);

  const editPlayerFunction = async (
    playerId: number,
    params: FormData
  ): Promise<EditPlayerResponse> => {
    let response = await editPlayerHelper(playerId, params, setSubmitting);

    return {
      ...response,
      success: response.success ?? false,
    };
  };

  return {
    submitting,
    isModalOpen,
    modalTitle,
    modalBody,
    confirmAction,
    editPlayerData,
    players,
    ...handlers,
    setSubmitting,
    editPlayer: editPlayerFunction,
  };
};
