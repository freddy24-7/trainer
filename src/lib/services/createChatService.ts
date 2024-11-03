import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';

export const createMessage = async (
  content: string,
  senderId: number,
  recipientId?: number // Optional recipientId for private messages
): Promise<Message> => {
  return prisma.message.create({
    data: {
      content,
      senderId,
      recipientId: recipientId || null, // Set recipientId if provided, otherwise null for group messages
      createdAt: new Date(),
    },
  });
};

export const getSenderById = async (senderId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
