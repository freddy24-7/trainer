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
