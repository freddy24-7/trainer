'use server';

import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';
import { createMessageSchema } from '@/schemas/messageSchema';
import { ZodIssue } from 'zod';
import { ActionResponse } from '@/types/type-list';

export default async function addMessage(
  _prevState: any,
  params: FormData
): Promise<ActionResponse> {
  const validation = createMessageSchema.safeParse({
    content: params.get('content'),
    senderId: Number(params.get('senderId')),
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  const { content, senderId } = validation.data;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        createdAt: new Date(),
      },
    });

    console.log('Message successfully saved:', message);

    const pusherResponse = await pusher.trigger('chat', 'new-message', {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      sender: {
        id: message.senderId,
        username: (
          await prisma.user.findUnique({
            where: { id: message.senderId },
          })
        )?.username,
      },
    });

    console.log(
      'Pusher event triggered for new message:',
      message.id,
      pusherResponse
    );

    return { success: true };
  } catch (error) {
    console.error('Error adding message:', error);

    return {
      success: false,
      errors: [
        {
          message: 'Error sending the message.',
          path: ['form'],
          code: 'custom',
        },
      ] as ZodIssue[],
    };
  }
}
