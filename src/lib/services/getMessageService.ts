import prisma from '@/lib/prisma';
import { formatError } from '@/utils/errorUtils';

export async function fetchMessages(): Promise<{
  messages: unknown[];
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
