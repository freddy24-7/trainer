import { createUserInClerk } from '@/lib/services/clerkService';
import { CreateClerkUserResult } from '@/type-list/types';

export async function createClerkUser(
  username: string,
  password: string
): Promise<CreateClerkUserResult> {
  return await createUserInClerk({ username, password });
}
