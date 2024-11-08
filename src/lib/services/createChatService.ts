import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function createMessage(
  content: string,
  senderId: number,
  recipientId: number | undefined,
  videoUrl: string | null = null
): Promise<Message> {
  return prisma.message.create({
    data: {
      content,
      senderId,
      recipientId,
      videoUrl,
    },
  });
}

export const getSenderById = async (senderId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
