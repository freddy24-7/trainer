import { z } from 'zod';

import {
  clerkIdRequiredMessage,
  usernameRequiredMessage,
} from '@/strings/validationStrings';

export const UserSchema = z.object({
  clerkId: z.string().min(1, clerkIdRequiredMessage),
  username: z.string().min(1, usernameRequiredMessage),
  role: z.enum(['TRAINER', 'PLAYER']),
});
