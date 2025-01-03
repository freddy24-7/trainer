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
        recipientId?: number | null;
        videoUrl?: string;
        videoPublicId?: string;
      };
    }
  | { success: false; error: ZodError } => {
  const rawContent = params.get('content');
  const rawSenderId = params.get('senderId');
  const rawRecipientId = params.get('recipientId'); // Always attempt to retrieve
  const rawVideoUrl = params.get('videoUrl');
  const rawVideoPublicId = params.get('videoPublicId');

  const parsed = createMessageSchema.safeParse({
    content: rawContent ?? undefined,
    senderId: rawSenderId ? Number(rawSenderId) : NaN,
    recipientId: rawRecipientId ? Number(rawRecipientId) : null, // Handle null gracefully
    videoUrl: rawVideoUrl ? String(rawVideoUrl) : undefined,
    videoPublicId: rawVideoPublicId ? String(rawVideoPublicId) : undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  return {
    success: true,
    data: parsed.data,
  };
};
