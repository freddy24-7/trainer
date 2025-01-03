import { Message, VideoData } from '@/types/message-types';

export function handlePrepareFormData({
  newMessage,
  signedInUserId,
  selectedRecipientId,
  selectedVideo,
}: {
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
  selectedVideo: VideoData | null;
}): FormData {
  const formData = new FormData();

  // Ensure senderId is a valid number
  if (!Number.isFinite(signedInUserId)) {
    throw new Error(`Invalid senderId: ${signedInUserId}`);
  }
  formData.append('senderId', signedInUserId.toString());

  // Ensure recipientId is a valid number or null
  if (selectedRecipientId !== null && !Number.isFinite(selectedRecipientId)) {
    throw new Error(`Invalid recipientId: ${selectedRecipientId}`);
  }
  if (selectedRecipientId !== null) {
    formData.append('recipientId', selectedRecipientId.toString());
  }

  // Ensure content is provided
  if (newMessage.trim() === '' && !selectedVideo) {
    throw new Error('Message content or video must be provided.');
  }
  formData.append('content', newMessage.trim());

  // Add video data if available
  if (selectedVideo) {
    formData.append('videoUrl', selectedVideo.url);
    formData.append('videoPublicId', selectedVideo.publicId);
  }

  return formData;
}

export function createOptimisticMessage({
  temporaryId,
  newMessage,
  signedInUserId,
  selectedRecipientId,
  selectedVideo,
}: {
  temporaryId: number;
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
  selectedVideo: VideoData | null; // Updated to use VideoData
}): Message | null {
  if (selectedRecipientId !== null) {
    return {
      id: temporaryId,
      content: newMessage,
      sender: { id: signedInUserId, username: 'You' },
      createdAt: new Date(),
      videoUrl: selectedVideo ? selectedVideo.url : null, // Use URL from VideoData
      recipientId: selectedRecipientId,
    };
  }
  return null;
}

export function handleValidateMessage(
  newMessage: string,
  selectedVideo: VideoData | null // Updated to use VideoData
): boolean {
  return newMessage.trim() !== '' || selectedVideo !== null;
}
