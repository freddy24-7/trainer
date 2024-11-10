import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long'),
  senderId: z.number().positive('Invalid sender ID'),
  recipientId: z.number().positive('Invalid recipient ID').optional(),
});
