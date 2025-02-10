import React from 'react';
import { ZodIssue } from 'zod';

import { handleValidateMatchPlayerData } from '@/schemas/validation/addMatchPlayerValidation';
import {
  playersDataMissingMessage,
  invalidPlayerDataFormatMessage,
  playersDataNotArrayMessage,
  invalidMinutesValueMessage,
} from '@/strings/serverStrings';
import { MatchFormValues, PlayerInMatch } from '@/types/match-types';
import { Player, PlayerResponseData } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

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
        minutes: player.available ? player.minutes : 0,
        available: player.available,
      }).success
  );
};

export function handleParsePlayersData(playersString: string | null): {
  players?: PlayerInMatch[];
  errors?: ZodIssue[];
} {
  if (!playersString) {
    return formatError(playersDataMissingMessage, ['players']);
  }

  let players: PlayerInMatch[];
  try {
    players = JSON.parse(playersString);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : invalidPlayerDataFormatMessage;
    return formatError(`${invalidPlayerDataFormatMessage} ${errorMessage}`, [
      'players',
    ]);
  }

  if (!Array.isArray(players)) {
    return formatError(playersDataNotArrayMessage, ['players']);
  }

  return { players };
}

export function handleValidatePlayerData(player: PlayerInMatch): {
  isValid: boolean;
  parsedMinutes: number;
  errors: ZodIssue[];
} {
  const { id, minutes, available } = player;

  const parsedMinutes = available ? parseInt(minutes, 10) : 0;

  if (available && (isNaN(parsedMinutes) || parsedMinutes < 0)) {
    return {
      isValid: false,
      parsedMinutes: 0,
      errors: formatError(
        invalidMinutesValueMessage.replace('{id}', id.toString()),
        ['players', 'minutes']
      ).errors,
    };
  }

  return { isValid: true, parsedMinutes, errors: [] };
}
