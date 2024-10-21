import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';

export const createMessage = async (
  content: string,
  senderId: number
): Promise<Message> => {
  return prisma.message.create({
    data: {
      content,
      senderId,
      createdAt: new Date(),
    },
  });
};

export const getSenderById = async (senderId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
