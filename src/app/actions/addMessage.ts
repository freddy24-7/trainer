'use server';

import fs from 'fs';

import { handleUploadVideo } from '@/lib/cloudinary';
import { createMessage, getSenderById } from '@/lib/services/createChatService';
import { validateMessageInput } from '@/schemas/validation/addMessageValidation';
import { Sender, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { formatError } from '@/utils/errorUtils';
import { handleTriggerNewMessageEvent } from '@/utils/pusherUtils';

async function handleProcessVideoFile(
  params: FormData
): Promise<{ videoUrl: string | null; videoPublicId: string | null }> {
  if (!params.has('videoFile')) {
    return { videoUrl: null, videoPublicId: null };
  }

  const videoFile = params.get('videoFile') as File;
  if (!videoFile) {
    return { videoUrl: null, videoPublicId: null };
  }

  const filePath = `/tmp/${videoFile.name}`;
  try {
    const buffer = await videoFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const { url, publicId } = await handleUploadVideo(filePath);
    return { videoUrl: url, videoPublicId: publicId };
  } catch (uploadError) {
    console.error('Error uploading video:', uploadError);
    throw formatError(
      'Error uploading video.',
      ['upload'],
      'custom',
      true
    ) as ActionResponse;
  } finally {
    fs.unlinkSync(filePath);
  }
}

async function getSenderData(senderId: number): Promise<Sender> {
  const senderData = await getSenderById(senderId);
  if (!senderData || !senderData.username) {
    console.error('Sender not found or username is null');
    throw formatError(
      'Error: Sender not found or username is null',
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

  const { content, senderId, recipientId } = validation.data;

  let videoUrl: string | null = null;
  let videoPublicId: string | null = null;

  try {
    const videoResult = await handleProcessVideoFile(params);
    videoUrl = videoResult.videoUrl;
    videoPublicId = videoResult.videoPublicId;
  } catch (error) {
    return error as ActionResponse;
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

    const sender = await getSenderData(messageFromCreate.senderId);

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
