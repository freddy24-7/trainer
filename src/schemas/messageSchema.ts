import { z } from 'zod';

import {
  messageTooLongErrorMessage,
  invalidSenderIdMessage,
  invalidRecipientIdMessage,
} from '@/strings/validationStrings';

export const createMessageSchema = z.object({
  content: z.string().max(1000, messageTooLongErrorMessage).optional(),
  senderId: z.number().positive(invalidSenderIdMessage),
  recipientId: z
    .union([z.number().positive(invalidRecipientIdMessage), z.null()])
    .optional(),
  videoUrl: z.string().url().optional(),
  videoPublicId: z.string().optional(),
});
