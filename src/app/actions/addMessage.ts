'use server';

import { createMessage, getSenderById } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import { Sender, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/response-types';
import { formatError } from '@/utils/errorUtils';
import { handleTriggerNewMessageEvent } from '@/utils/pusherUtils';

export default async function addMessage(
  _prevState: unknown,
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
    const messageFromCreate = await createMessage(content, senderId);

    console.log('Message successfully saved:', messageFromCreate);

    const senderData = await getSenderById(messageFromCreate.senderId);

    if (!senderData) {
      console.error('Sender not found');
      return formatError(
        'Error sending the message: Sender not found',
        ['form'],
        'custom',
        true
      ) as ActionResponse;
    }

    if (!senderData.username) {
      console.error('Sender username is null');
      return formatError(
        'Error sending the message: Username is null',
        ['form'],
        'custom',
        true
      ) as ActionResponse;
    }

    const sender: Sender = {
      id: senderData.id,
      username: senderData.username,
    };

    const completeMessage: Message = {
      ...messageFromCreate,
      sender, // Add the sender property
    };

    await handleTriggerNewMessageEvent(completeMessage, sender);

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
