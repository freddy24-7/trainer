import prisma from '@/lib/prisma';

export const createMessage = async (content: string, senderId: number) => {
  return prisma.message.create({
    data: {
      content,
      senderId,
      createdAt: new Date(),
    },
  });
};

export const getSenderById = async (senderId: number) => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
