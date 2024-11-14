import { PlayerResponseData, PlayerResponse } from '@/types/user-types';

interface PlayerApiResponse {
  success?: boolean;
  players?: PlayerResponse[];
  errors?: undefined;
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
