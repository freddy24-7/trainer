import { editPlayerSchema } from '@/schemas/editPlayerSchema';
import { ZodIssue } from 'zod';

export function validateEditPlayerData(params: FormData): {
  success: boolean;
  data?: any;
  errors: ZodIssue[];
} {
  const username = params.get('username');
  const password = params.get('password');
  const whatsappNumber = params.get('whatsappNumber');

  if (!username || !whatsappNumber) {
    return {
      success: false,
      errors: [
        {
          message: 'Username and WhatsApp number are required.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }

  const validation = editPlayerSchema.safeParse({
    username: username as string,
    password: password || undefined,
    whatsappNumber: whatsappNumber as string,
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  return {
    success: true,
    data: validation.data,
    errors: [],
  };
}
