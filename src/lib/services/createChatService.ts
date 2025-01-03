import { Message, User } from '@prisma/client';

import prisma from '@/lib/prisma';
import { CreateMessageParams } from '@/types/message-types';

export async function createMessage(
  params: CreateMessageParams
): Promise<Message> {
  console.log('Received params for createMessage:', params); // Log the entire input

  const { content, senderId, recipientId, videoUrl, videoPublicId } = params;

  console.log('Data passed to Prisma create:', {
    content,
    senderId,
    recipientId,
    videoUrl,
    videoPublicId,
  });

  try {
    const result = await prisma.message.create({
      data: {
        content: content ?? '',
        senderId,
        recipientId,
        videoUrl,
        videoPublicId,
      },
    });

    console.log('Database response from Prisma:', result); // Log database response
    return result;
  } catch (error) {
    console.error('Error while creating message:', error); // Log error if Prisma call fails
    throw error; // Rethrow the error to propagate it upwards
  }
}

export const getSenderById = async (senderId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: senderId },
  });
};
