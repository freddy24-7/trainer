import React from 'react';
import { Player, PlayerResponse, PlayerResponseData } from '@/lib/types';
import { validateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import { MatchFormValues } from '@/lib/types';

export function mapPlayers(response: Partial<PlayerResponseData>): Player[] {
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

export const validateAllPlayers = (
  players: any[],
  selectedPouleId: number | undefined
) => {
  return players.every(
    (player) =>
      validateMatchPlayerData({
        userId: player.id,
        matchId: selectedPouleId ?? 0,
        minutes: typeof player.minutes === 'number' ? player.minutes : 0,
        available: player.available,
      }).success
  );
};

export const getPlayerMinutes = (players: MatchFormValues['players']) =>
  players.reduce(
    (acc, player) => ({ ...acc, [player.id]: player.minutes }),
    {}
  );

export const getPlayerAvailability = (players: MatchFormValues['players']) =>
  players.reduce(
    (acc, player) => ({ ...acc, [player.id]: player.available }),
    {}
  );

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
