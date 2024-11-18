import { PlayerResponseData, PlayerApiResponse } from '@/types/user-types';

export function handlePlayerResponse(
  response: PlayerApiResponse
): PlayerResponseData {
  return {
    success: response?.success ?? false,
    players: response?.players ?? [],
    errors: response?.errors ?? [],
  };
}
