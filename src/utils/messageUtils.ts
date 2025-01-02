import { Message } from '@/types/message-types';

export function handlePrepareFormData({
  newMessage,
  signedInUserId,
  selectedRecipientId,
  selectedVideo,
}: {
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
  selectedVideo: string | File | null;
}): FormData {
  const formData = new FormData();
  formData.append('content', newMessage);
  formData.append('senderId', signedInUserId.toString());

  if (selectedRecipientId !== null) {
    formData.append('recipientId', selectedRecipientId.toString());
  }

  if (selectedVideo) {
    formData.append('videoUrl', selectedVideo);
  }

  return formData;
}

export function createOptimisticMessage({
  temporaryId,
  newMessage,
  signedInUserId,
  selectedRecipientId,
  videoUrl,
}: {
  temporaryId: number;
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
  selectedVideo: string | null;
  videoUrl?: string | null;
}): Message | null {
  if (selectedRecipientId !== null) {
    return {
      id: temporaryId,
      content: newMessage,
      sender: { id: signedInUserId, username: 'You' },
      createdAt: new Date(),
      videoUrl: videoUrl || null,
      recipientId: selectedRecipientId,
    };
  }
  return null;
}

export function handleValidateMessage(
  newMessage: string,
  selectedVideo: string | File | null
): boolean {
  return newMessage.trim() !== '' || selectedVideo !== null;
}
