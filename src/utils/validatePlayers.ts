import { FormValues } from '@/types/types';
export function handleValidatePlayers(
  playerValues: FormValues['players']
): boolean {
  return playerValues.every((player) => {
    if (!player.available) {
      return true;
    } else {
      const minutesNumber = parseInt(player.minutes as string, 10);
      return !isNaN(minutesNumber) && minutesNumber > 0;
    }
  });
}
