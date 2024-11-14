import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';

interface CreateMessageParams {
  content: string | null;
  senderId: number;
  recipientId?: number;
  videoUrl?: string | null;
  videoPublicId?: string | null;
}

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
