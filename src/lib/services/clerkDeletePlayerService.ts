import { deleteUser } from '@/lib/services/clerkService';

export async function deleteUserInClerk(clerkId: string): Promise<void> {
  await deleteUser(clerkId);
}
