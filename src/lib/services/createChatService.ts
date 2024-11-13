import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function createMessage(
  content: string | null,
  senderId: number,
  recipientId: number | undefined,
  videoUrl: string | null = null,
  videoPublicId: string | null
): Promise<Message> {
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
