import prisma from '@/lib/prisma';
import { Message } from '@/types/types';

export default async function getMessages(): Promise<{
  messages: Message[];
  success: boolean;
  error?: string;
}> {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, username: true },
        },
      },
    });

    const formattedMessages = messages.map((message) => ({
      ...message,
      id: message.id,
      sender: {
        ...message.sender,
        id: message.sender.id,
      },
    }));

    return { messages: formattedMessages, success: true };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { messages: [], success: false, error: 'Failed to load messages.' };
  }
}
