import { z } from 'zod';

export const UserSchema = z.object({
  clerkId: z.string().min(1, 'clerkId is required'),
  username: z.string().min(1, 'Username is required'),
  role: z.enum(['TRAINER', 'PLAYER']),
});
