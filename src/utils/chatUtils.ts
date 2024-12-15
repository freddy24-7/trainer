import React from 'react';

import {
  failedToDeleteVideoMessage,
  failedToDeleteMessageMessage,
  failedToSendMessageErrorsMessage,
  failedToSendMessageUnknownMessage,
} from '@/strings/serverStrings';
import {
  PusherEventMessage,
  Message,
  HandleOnDeleteVideoParams,
  HandleOnDeleteMessageParams,
  HandleSendMessageParams,
  SubscribeToPusherEventsParams,
} from '@/types/message-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

/**
 * Subscribes to Pusher events for real-time updates.
 */
export const subscribeToPusherEvents = ({
  onMessageReceived,
  onDeleteMessage,
  setLoading,
  userId,
}: SubscribeToPusherEventsParams): (() => void) => {
  const handlePusherEvent = (data: PusherEventMessage): void => {
    if (data.type === 'delete-message') {
      onDeleteMessage(data.id);
    } else {
      onMessageReceived(data);
    }
  };

  const cleanup = handleInitializePusher(handlePusherEvent, userId || 0);
  setLoading(false);

  return cleanup;
};

/**
 * Deletes a video's URL locally from the message list.
 */
export const handleDeleteVideoLocal = (
  messageId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): void => {
  setMessages((prevMessages) =>
    prevMessages.map((msg) =>
      msg.id === messageId ? { ...msg, videoUrl: null } : msg
    )
  );
};

/**
 * Handles deleting a video message, with an option to remove it from the database.
 */
export async function handleOnDeleteVideo({
  messageId,
  removeFromDatabase,
  deleteVideo,
  signedInUserId,
  setMessages,
}: HandleOnDeleteVideoParams): Promise<void> {
  if (removeFromDatabase) {
    const response = await deleteVideo(messageId, signedInUserId);
    if (response.success) {
      handleDeleteVideoLocal(messageId, setMessages);
    } else {
      console.error(failedToDeleteVideoMessage);
    }
  } else {
    handleDeleteVideoLocal(messageId, setMessages);
  }
}

/**
 * Handles deleting a message, with an option to remove it from the database.
 */
export async function handleOnDeleteMessage({
  messageId,
  removeFromDatabase,
  deleteMessage,
  signedInUserId,
  handleDeleteMessage,
}: HandleOnDeleteMessageParams): Promise<void> {
  if (removeFromDatabase) {
    const response = await deleteMessage(messageId, signedInUserId);
    if (response.success) {
      handleDeleteMessage(messageId, true);
    } else {
      console.error(failedToDeleteMessageMessage);
    }
  } else {
    handleDeleteMessage(messageId, false);
  }
}

/**
 * Sends a message with optimistic updates for the UI.
 */
export async function handleSendMessage({
  e,
  newMessage,
  selectedVideo,
  setIsSending,
  signedInUserId,
  selectedRecipientId,
  action,
  setNewMessage,
  setSelectedVideo,
  setMessages,
}: HandleSendMessageParams): Promise<void> {
  e.preventDefault();

  if (!newMessage.trim() && !selectedVideo) {
    return;
  }

  setIsSending(true);

  const formData = new FormData();
  formData.append('content', newMessage);
  formData.append('senderId', signedInUserId.toString());

  if (selectedRecipientId !== null) {
    formData.append('recipientId', selectedRecipientId.toString());
  }

  if (selectedVideo) {
    formData.append('videoFile', selectedVideo);
  }

  // Optimistically add the message to the UI
  const optimisticMessage: Message = {
    id: Date.now(), // Temporary ID; replace with actual ID from server response if available
    content: newMessage,
    sender: { id: signedInUserId, username: 'You' }, // Adjust as necessary
    createdAt: new Date(),
    videoUrl: selectedVideo ? URL.createObjectURL(selectedVideo) : null,
    recipientId: selectedRecipientId,
  };

  setMessages((prev) => [...prev, optimisticMessage]);

  try {
    const response = await action({}, formData);

    if (response.success) {
      setNewMessage('');
      setSelectedVideo(null);
    } else if (response.errors) {
      const errorMessages = response.errors
        .map((error) => error.message)
        .join(', ');
      console.error(failedToSendMessageErrorsMessage, errorMessages);
      // Optionally handle rollback of optimistic UI here
    } else {
      console.error(failedToSendMessageUnknownMessage);
      // Optionally handle rollback of optimistic UI here
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // Optionally handle rollback of optimistic UI here
  } finally {
    setIsSending(false);
  }
}
