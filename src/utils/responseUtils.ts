import { PlayerResponseData, PlayerResponse } from '@/types/user-types';

interface PlayerApiResponse {
  success?: boolean;
  players?: PlayerResponse[];
  errors?: unknown[];
}

export function handlePlayerResponse(
  response: PlayerApiResponse
): PlayerResponseData {
  return {
    success: response?.success ?? false,
    players: response?.players ?? [],
    errors: response?.errors ?? [],
  };
}
