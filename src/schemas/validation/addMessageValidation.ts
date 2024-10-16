import { createMessageSchema } from '@/schemas/messageSchema';

export const validateMessageInput = (params: FormData) => {
  return createMessageSchema.safeParse({
    content: params.get('content'),
    senderId: Number(params.get('senderId')),
  });
};
