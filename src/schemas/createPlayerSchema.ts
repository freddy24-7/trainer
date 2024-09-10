import { z } from 'zod';

// Defining a schema specifically for player creation form validation
export const createPlayerSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(
      /[@$!%*?&#]/,
      'Password must contain at least one special character'
    ),
});
