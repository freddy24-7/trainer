'use server';

import { fetchMessages } from '@/lib/services/getMessageService';
import { Message } from '@/types/message-types';

export default async function getMessages(
  signedInUserId: number,
  recipientId?: number
): Promise<{
  messages: Message[];
  success: boolean;
  error?: string;
}> {
  return await fetchMessages(signedInUserId, recipientId);
}
