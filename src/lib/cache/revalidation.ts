import { revalidatePath } from 'next/cache';

export function handleRevalidatePlayerManagementCache(): void {
  revalidatePath('/player-management');
}
