import { createPlayerSchema } from '@/schemas/createPlayerSchema';
import { ZodIssue } from 'zod';

export function validatePlayerData(params: FormData): {
  success: boolean;
  data?: any;
  errors?: ZodIssue[];
} {
  const username = params.get('username');
  const password = params.get('password');
  const whatsappNumber = params.get('whatsappNumber');

  if (!username || !password || !whatsappNumber) {
    return {
      success: false,
      errors: [
        {
          message: 'Username, password, and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }

  const validation = createPlayerSchema.safeParse({
    username: username as string,
    password: password as string,
    whatsappNumber: whatsappNumber as string,
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  return { success: true, data: validation.data, errors: [] };
}
