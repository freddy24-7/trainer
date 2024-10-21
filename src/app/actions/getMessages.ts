'use server';

import { fetchMessages } from '@/lib/services/getMessageService';

export default async function getMessages(): Promise<{
  messages: unknown[];
  success: boolean;
  error?: string;
}> {
  return await fetchMessages();
}
