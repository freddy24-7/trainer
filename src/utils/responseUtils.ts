import { PlayerResponseData } from '@/types/type-list';

export function validatePlayerResponse(response: any): PlayerResponseData {
  return {
    success: response?.success ?? false,
    players: response?.players ?? [],
    errors: response?.errors ?? [],
  };
}
