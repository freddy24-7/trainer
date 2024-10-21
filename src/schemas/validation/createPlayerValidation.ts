import { ZodIssue } from 'zod';

import { createPlayerSchema } from '@/schemas/createPlayerSchema';
import { PlayerFormData } from '@/types/user-types';

export function handleValidatePlayerData(params: FormData): {
  success: boolean;
  data?: PlayerFormData;
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

  return { success: true, data: validation.data as PlayerFormData, errors: [] };
}
