import { z } from 'zod';

import {
  emptyMessageErrorMessage,
  messageTooLongErrorMessage,
  invalidSenderIdMessage,
  invalidRecipientIdMessage,
} from '@/strings/validationStrings';

export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, emptyMessageErrorMessage)
    .max(1000, messageTooLongErrorMessage),
  senderId: z.number().positive(invalidSenderIdMessage),
  recipientId: z.number().positive(invalidRecipientIdMessage).optional(),
  videoUrl: z.string().url().optional(),
});
