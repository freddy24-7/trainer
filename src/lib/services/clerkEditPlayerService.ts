import { updateUserInClerk } from '@/lib/services/clerkService';

export async function updateClerkUser(
  clerkId: string,
  data: { username: string; password?: string }
): Promise<void> {
  await updateUserInClerk(clerkId, data);
}
