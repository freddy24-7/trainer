import React from 'react';
import { Player, PlayerResponse, PlayerResponseData } from '@/lib/types';

export function mapPlayers(response: PlayerResponseData): Player[] {
  if (!response.success) {
    return [];
  }

  return (response.players ?? []).map((player: PlayerResponse) => ({
    id: Number(player.id),
    username: player.username ?? '',
    whatsappNumber: player.whatsappNumber ?? '',
  }));
}

export const updatePlayerList = (
  updatedPlayer: Player,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setPlayers((prevPlayers) =>
    prevPlayers.map((player) =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    )
  );
  setSubmitting(false);
};
