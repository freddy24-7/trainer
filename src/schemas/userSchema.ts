import { z } from 'zod';

const allowedUsernames = process.env.ALLOWED_SIGNUP_USERNAMES?.split(',') || [];

export const UserSchema = z.object({
  clerkId: z.string().min(1, 'clerkId is required'),
  username: z
    .string()
    .min(1, 'Username is required')
    .refine((username) => allowedUsernames.includes(username), {
      message: 'This username is not authorized to sign up.',
    }),
  role: z.enum(['TRAINER', 'PLAYER']),
});
