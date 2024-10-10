export interface PlayerValidation {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  clerkId: string | null;
}

export function handleValidatePlayer(
  player: PlayerValidation | null
): string | null {
  if (!player) {
    return 'Player not found.';
  }

  if (!player.clerkId) {
    return 'Clerk ID is missing.';
  }

  if (!player.username) {
    return 'Username is missing.';
  }

  if (!player.whatsappNumber) {
    return 'WhatsApp number is missing.';
  }

  return null;
}
