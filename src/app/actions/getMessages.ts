// This server action is responsible for fetching messages from the database.

'use server';

import prisma from '@/lib/prisma';

export default async function getMessages(): Promise<{
  messages: any[];
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
    return { messages: [], success: false, error: 'Failed to load messages.' };
  }
}
