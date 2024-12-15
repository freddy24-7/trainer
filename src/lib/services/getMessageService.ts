import prisma from '@/lib/prisma';
import { Message } from '@/types/message-types';
import { formatError } from '@/utils/errorUtils';

export async function fetchMessages(
  signedInUserId: number,
  recipientId?: number
): Promise<{
  messages: Message[];
  success: boolean;
  error?: string;
}> {
  try {
    const rawMessages = await prisma.message.findMany({
      where: recipientId
        ? {
            OR: [
              { senderId: signedInUserId, recipientId },
              { senderId: recipientId, recipientId: signedInUserId },
            ],
          }
        : { recipientId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, username: true } },
      },
    });

    const messages: Message[] = rawMessages.map((message) => ({
      id: message.id,
      content: message.content || null,
      sender: {
        id: message.sender.id,
        username: message.sender.username || 'Unknown',
      },
      videoUrl: message.videoUrl || null,
      createdAt: message.createdAt,
      recipientId: message.recipientId || null,
    }));

    return { messages, success: true };
  } catch (error) {
    console.error('Error fetching messages:', error);

    const formattedError = formatError(
      'Failed to load messages.',
      ['database', 'fetchMessages'],
      'custom',
      true
    );

    return {
      messages: [],
      success: false,
      error: formattedError.errors[0].message,
    };
  }
}
