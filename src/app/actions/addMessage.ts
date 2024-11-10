'use server';

import { handleUploadVideo } from '@/lib/cloudinary';
import { createMessage, getSenderById } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import { Sender, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
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

  const { content, senderId, recipientId } = validation.data;
  let videoUrl = null;

  if (params.has('videoFile')) {
    const videoFile = params.get('videoFile') as File;
    if (videoFile) {
      const filePath = `/tmp/${videoFile.name}`;
      try {
        await videoFile
          .arrayBuffer()
          .then((buffer) =>
            require('fs').writeFileSync(filePath, Buffer.from(buffer))
          );

        videoUrl = await handleUploadVideo(filePath);
      } catch (uploadError) {
        console.error('Error uploading video:', uploadError);
        return formatError(
          'Error uploading video.',
          ['upload'],
          'custom',
          true
        ) as ActionResponse;
      } finally {
        require('fs').unlinkSync(filePath);
      }
    }
  }

  try {
    const messageFromCreate = await createMessage(
      content || null,
      senderId,
      recipientId,
      videoUrl
    );

    console.log('Message successfully saved:', messageFromCreate);

    const senderData = await getSenderById(messageFromCreate.senderId);
    if (!senderData || !senderData.username) {
      console.error('Sender not found or username is null');
      return formatError(
        'Error sending the message: Sender not found or username is null',
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
      sender,
    };

    await handleTriggerNewMessageEvent(completeMessage, sender, recipientId);

    return { success: true, videoUrl };
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
