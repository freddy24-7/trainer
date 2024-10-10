import { createUser as createUserInService } from '@/lib/services/prismaPlayerService';

export async function createPrismaUser(
  clerkUserId: string,
  username: string,
  whatsappNumber: string
): Promise<void> {
  await createUserInService(clerkUserId, username, whatsappNumber);
}
