import prisma from '@/lib/prisma';
import { formatError } from '@/utils/errorUtils';

export async function fetchMessages(
  signedInUserId: number,
  recipientId?: number
): Promise<{
  messages: unknown[];
  success: boolean;
  error?: string;
}> {
  try {
    const messages = await prisma.message.findMany({
      where: recipientId
        ? {
            OR: [
              { senderId: signedInUserId, recipientId },
              { senderId: recipientId, recipientId: signedInUserId },
            ],
          }
        : { recipientId: null }, // Only group messages if no recipientId
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, username: true } },
        recipient: { select: { id: true, username: true } },
      },
    });

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
