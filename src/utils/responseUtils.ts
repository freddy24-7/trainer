import { PlayerResponseData } from '@/types/user-types';

export function validatePlayerResponse(response: any): PlayerResponseData {
  return {
    success: response?.success ?? false,
    players: response?.players ?? [],
    errors: response?.errors ?? [],
  };
}
