'use server';

import { fetchMessages } from '@/lib/services/getMessageService';

export default async function getMessages() {
  return await fetchMessages();
}
