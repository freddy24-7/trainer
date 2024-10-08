'use server';

import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';
import { createMessageSchema } from '@/schemas/messageSchema';
import { ActionResponse } from '@/types/types';

function handleMessageValidation(
  params: FormData
): ReturnType<typeof createMessageSchema.safeParse> {
  return createMessageSchema.safeParse({
    content: params.get('content'),
    senderId: Number(params.get('senderId')),
  });
}

async function createMessageAndTriggerPusher(
  content: string,
  senderId: number
): Promise<ReturnType<typeof prisma.message.create>> {
  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      createdAt: new Date(),
    },
  });

  console.log('Message successfully saved:', message);

  const sender = await prisma.user.findUnique({
    where: { id: message.senderId },
  });

  const pusherResponse = await pusher.trigger('chat', 'new-message', {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    createdAt: message.createdAt,
    sender: {
      id: message.senderId,
      username: sender?.username,
    },
  });

  console.log(
    'Pusher event triggered for new message:',
    message.id,
    pusherResponse
  );

  return message;
}

export default async function createMessage(
  _prevState: unknown,
  params: FormData
): Promise<ActionResponse> {
  const validation = handleMessageValidation(params);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  const { content, senderId } = validation.data;

  try {
    await createMessageAndTriggerPusher(content, senderId);
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
