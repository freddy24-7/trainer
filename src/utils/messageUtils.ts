import { getSenderById } from '@/lib/services/createChatService';
import { Sender } from '@/types/message-types';

export async function getAndValidateSender(
  senderId: number
): Promise<Sender | null> {
  const senderData = await getSenderById(senderId);

  if (!senderData || !senderData.username) {
    console.error('Sender not found or username is null');
    return null;
  }

  return { id: senderData.id, username: senderData.username };
}
