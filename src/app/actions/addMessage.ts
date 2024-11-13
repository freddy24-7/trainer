'use server';

import { createMessage } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import { Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';
import { handleFileUpload } from '@/utils/fileUtils';
import { getAndValidateSender } from '@/utils/messageUtils';
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

  const { content, senderId, recipientId } = validation.data;
  let videoUrl = null;
  let videoPublicId = null;

  if (params.has('videoFile')) {
    const videoFile = params.get('videoFile') as File;
    const uploadResult = await handleFileUpload(videoFile);

    if (!uploadResult.success) {
      return uploadResult;
    }

    videoUrl = uploadResult.videoUrl;
    videoPublicId = uploadResult.videoPublicId;
  }

  try {
    const messageFromCreate = await createMessage({
      content: content || null,
      senderId,
      recipientId,
      videoUrl,
      videoPublicId,
    });

    console.log('Message successfully saved:', messageFromCreate);

    const sender = await getAndValidateSender(senderId);
    if (!sender) {
      return formatError(
        'Error sending the message: Sender not found or username is null',
        ['form'],
        'custom',
        true
      ) as ActionResponse;
    }

    const completeMessage: Message = {
      ...messageFromCreate,
      sender,
    };

    await handleTriggerNewMessageEvent(completeMessage, sender, recipientId);

    return { success: true, videoUrl };
  } catch (error) {
    console.error('Error adding message:', error);
    return formatError(
      'Error sending the message.',
      ['form'],
      'custom',
      true
    ) as ActionResponse;
  }
}
