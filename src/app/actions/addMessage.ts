'use server';

import { createMessage, getSenderById } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import { ActionResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { triggerNewMessageEvent } from '@/utils/pusherUtils';

export default async function addMessage(
  _prevState: any,
  params: FormData
): Promise<ActionResponse> {
  const validation = validateMessageInput(params);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.issues,
    };
  }

  const { content, senderId } = validation.data;

  try {
    const message = await createMessage(content, senderId);

    console.log('Message successfully saved:', message);

    const sender = await getSenderById(message.senderId);

    await triggerNewMessageEvent(message, sender);

    return { success: true };
  } catch (error) {
    console.error('Error adding message:', error);

    const errorResponse = formatError(
      'Error sending the message.',
      ['form'],
      'custom',
      true
    );

    return errorResponse as ActionResponse;
  }
}
