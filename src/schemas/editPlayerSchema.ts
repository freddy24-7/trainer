import { z } from 'zod';

import {
  usernameLengthErrorMessage,
  passwordLengthErrorMessage,
  passwordUppercaseErrorMessage,
  passwordSpecialCharacterErrorMessage,
  whatsappNumberErrorMessage,
} from '@/strings/validationStrings';

export const editPlayerSchema = z.object({
  username: z.string().min(4, usernameLengthErrorMessage),
  password: z
    .string()
    .min(8, passwordLengthErrorMessage)
    .regex(/[A-Z]/, passwordUppercaseErrorMessage)
    .regex(/[@$!%*?&#]/, passwordSpecialCharacterErrorMessage),
  whatsappNumber: z.string().regex(/^\+\d{10,14}$/, whatsappNumberErrorMessage),
});
