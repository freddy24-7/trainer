import { z } from 'zod';

// Defining a schema specifically for player creation form validation
export const createPlayerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .min(1, 'Password is required'),
});
