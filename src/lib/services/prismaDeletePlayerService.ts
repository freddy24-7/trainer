import { deleteUser } from '@/lib/services/prismaPlayerService';

export async function deleteUserInPrisma(playerId: number): Promise<void> {
  await deleteUser(playerId);
}
