import { z } from 'zod';

import {
  messageTooLongErrorMessage,
  invalidSenderIdMessage,
  invalidRecipientIdMessage,
} from '@/strings/validationStrings';

export const createMessageSchema = z.object({
  content: z.string().max(1000, messageTooLongErrorMessage).optional(),
  senderId: z.number().positive(invalidSenderIdMessage),
  recipientId: z.number().positive(invalidRecipientIdMessage).optional(),
  videoUrl: z.string().url().optional(),
  videoPublicId: z.string().optional().nullable(),
});
