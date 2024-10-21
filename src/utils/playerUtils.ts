import React from 'react';

import { handleValidateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import { MatchFormValues } from '@/types/match-types';
import { Player, PlayerResponseData } from '@/types/user-types';

export function handleMapPlayers(
  response: Partial<PlayerResponseData>
): Player[] {
  if (!response.success || !Array.isArray(response.players)) {
    return [];
  }

  return response.players.map((player) => ({
    id: player.id,
    username: player.username ?? '',
    whatsappNumber: player.whatsappNumber ?? '',
  }));
}

export const updatePlayerList = (
  updatedPlayer: Player,
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setPlayers((prevPlayers) =>
    prevPlayers.map((player) =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    )
  );
  setSubmitting(false);
};

export const validateAllPlayers = (
  players: MatchFormValues['players'],
  selectedPouleId: number | undefined
): boolean => {
  return players.every(
    (player) =>
      handleValidateMatchPlayerData({
        userId: player.id,
        matchId: selectedPouleId ?? 0,
        minutes: typeof player.minutes === 'number' ? player.minutes : 0,
        available: player.available,
      }).success
  );
};

export const getPlayerMinutes = (
  players: MatchFormValues['players']
): Record<number, number | ''> => {
  return players.reduce(
    (acc, player) => ({ ...acc, [player.id]: player.minutes }),
    {} as Record<number, number | ''>
  );
};

export const getPlayerAvailability = (
  players: MatchFormValues['players']
): Record<number, boolean> => {
  return players.reduce(
    (acc, player) => ({ ...acc, [player.id]: player.available }),
    {} as Record<number, boolean>
  );
};

export const updatePlayerMinutes = (
  players: MatchFormValues['players'],
  playerId: number,
  minutes: string | number
): MatchFormValues['players'] => {
  const parsedMinutes =
    typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;

  const validatedMinutes: number | '' =
    typeof minutes === 'string'
      ? isNaN(parsedMinutes)
        ? ''
        : parsedMinutes
      : minutes;

  return players.map((player) =>
    player.id === playerId
      ? {
          ...player,
          minutes: validatedMinutes,
        }
      : player
  );
};

export const updatePlayerAvailability = (
  players: MatchFormValues['players'],
  playerId: number,
  available: boolean
): MatchFormValues['players'] => {
  return players.map((player) =>
    player.id === playerId ? { ...player, available } : player
  );
};
