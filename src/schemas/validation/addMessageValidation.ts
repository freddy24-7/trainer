import { ZodError } from 'zod';

import { createMessageSchema } from '@/schemas/messageSchema';

export const validateMessageInput = (
  params: FormData
):
  | {
      success: true;
      data: {
        content?: string;
        senderId: number;
        recipientId?: number;
        videoUrl?: string;
        videoPublicId?: string | null; // Allow null
      };
    }
  | { success: false; error: ZodError } => {
  return createMessageSchema.safeParse({
    content: params.get('content'),
    senderId: Number(params.get('senderId')),
    recipientId: params.has('recipientId')
      ? Number(params.get('recipientId'))
      : undefined,
    videoUrl: params.get('videoUrl') || undefined,
    videoPublicId: params.get('videoPublicId') || null, // Default to null if not provided
  });
};
