import { z } from 'zod';

export const editPlayerSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(
      /[@$!%*?&#]/,
      'Password must contain at least one special character'
    ),
  whatsappNumber: z
    .string()
    .regex(
      /^\+\d{10,14}$/,
      'Please enter a valid WhatsApp number (including country code)'
    ),
});
