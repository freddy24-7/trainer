'use server';

import { fetchMessages } from '@/lib/services/getMessageService';

export default async function getMessages(
  signedInUserId: number,
  recipientId?: number
): Promise<{
  messages: unknown[];
  success: boolean;
  error?: string;
}> {
  return await fetchMessages(signedInUserId, recipientId);
}
