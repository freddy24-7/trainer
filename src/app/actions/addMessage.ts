'use server';

import { createMessage, getSenderById } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import {
  senderNotFoundOrUsernameNull,
  errorSendingMessage,
} from '@/strings/actionStrings';
import { Sender, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';
import { handleTriggerNewMessageEvent } from '@/utils/pusherUtils';

async function getSenderData(senderId: number): Promise<Sender> {
  const senderData = await getSenderById(senderId);
  if (!senderData || !senderData.username) {
    console.error(senderNotFoundOrUsernameNull);
    throw formatError(
      senderNotFoundOrUsernameNull,
      ['form'],
      'custom',
      true
    ) as ActionResponse;
  }
  return { id: senderData.id, username: senderData.username };
}

export default async function addMessage(
  _prevState: unknown,
  params: FormData
): Promise<ActionResponse> {
  const validation = validateMessageInput(params);

  if (!validation.success) {
    return { success: false, errors: validation.error.issues };
  }

  const { content, senderId, recipientId, videoUrl } = validation.data;

  try {
    const messageFromCreate = await createMessage({
      content: content || null,
      senderId,
      recipientId,
      videoUrl,
      videoPublicId: null,
    });

    console.log('Message successfully saved:', messageFromCreate);

    const sender = await getSenderData(messageFromCreate.senderId);

    const completeMessage: Message = {
      ...messageFromCreate,
      sender,
    };

    await handleTriggerNewMessageEvent(completeMessage, sender, recipientId);

    return { success: true, videoUrl };
  } catch (error) {
    console.error(errorSendingMessage, error);
    return formatError(
      errorSendingMessage,
      ['form'],
      'custom',
      true
    ) as ActionResponse;
  }
}
