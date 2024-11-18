import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';
import { CreateMessageParams } from '@/types/message-types';

export async function createMessage(
  params: CreateMessageParams
): Promise<Message> {
  const { content, senderId, recipientId, videoUrl, videoPublicId } = params;
  return prisma.message.create({
    data: {
      content: content ?? '',
      senderId,
      recipientId,
      videoUrl,
      videoPublicId,
    },
  });
}

export const getSenderById = async (senderId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
