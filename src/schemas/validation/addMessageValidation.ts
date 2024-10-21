import { ZodError } from 'zod';

import { createMessageSchema } from '@/schemas/messageSchema';

export const validateMessageInput = (
  params: FormData
):
  | { success: true; data: { content: string; senderId: number } }
  | { success: false; error: ZodError } => {
  return createMessageSchema.safeParse({
    content: params.get('content'),
    senderId: Number(params.get('senderId')),
  });
};
