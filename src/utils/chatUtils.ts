import React from 'react';

import {
  failedToDeleteVideoMessage,
  failedToDeleteMessageMessage,
} from '@/strings/serverStrings';
import {
  PusherEventMessage,
  Message,
  HandleOnDeleteVideoParams,
  HandleOnDeleteMessageParams,
  HandleSendMessageParams,
  SubscribeToPusherEventsParams,
} from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

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

function handlePrepareFormData({
  newMessage,
  signedInUserId,
  selectedRecipientId,
  selectedVideo,
}: {
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
  selectedVideo: File | null;
}): FormData {
  const formData = new FormData();
  formData.append('content', newMessage);
  formData.append('senderId', signedInUserId.toString());

  if (selectedRecipientId !== null) {
    formData.append('recipientId', selectedRecipientId.toString());
  }

  if (selectedVideo) {
    formData.append('videoFile', selectedVideo);
  }

  return formData;
}

function createOptimisticMessage({
  temporaryId,
  newMessage,
  signedInUserId,
  selectedRecipientId,
}: {
  temporaryId: number;
  newMessage: string;
  signedInUserId: number;
  selectedRecipientId: number | null;
}): Message | null {
  if (selectedRecipientId !== null) {
    return {
      id: temporaryId,
      content: newMessage,
      sender: { id: signedInUserId, username: 'You' },
      createdAt: new Date(),
      videoUrl: null,
      recipientId: selectedRecipientId,
    };
  }
  return null;
}

function handleLogErrors(errors: { message: string }[]): void {
  const errorMessages = errors.map((error) => error.message).join(', ');
  console.error('Failed to send message:', errorMessages);
}

function handleClearForm({
  setNewMessage,
  setSelectedVideo,
  setIsSending,
}: {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}): void {
  setNewMessage('');
  setSelectedVideo(null);
  setIsSending(false);
}

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
  addOptimisticMessage,
  replaceOptimisticMessage,
}: HandleSendMessageParams): Promise<void> {
  e.preventDefault();

  if (!handleValidateMessage(newMessage, selectedVideo)) {
    return;
  }

  setIsSending(true);

  const { temporaryId, formData, optimisticMessage } = handlePrepareMessageData(
    {
      newMessage,
      selectedVideo,
      signedInUserId,
      selectedRecipientId,
      addOptimisticMessage,
    }
  );

  try {
    const response = await action({}, formData);

    await handleProcessServerResponse({
      response,
      isIndividualMessageWithoutVideo:
        !selectedVideo && selectedRecipientId !== null,
      temporaryId,
      optimisticMessage,
      replaceOptimisticMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    handleClearForm({ setNewMessage, setSelectedVideo, setIsSending });
  }
}

function handleValidateMessage(
  newMessage: string,
  selectedVideo: File | null
): boolean {
  return newMessage.trim() !== '' || selectedVideo !== null;
}

function handlePrepareMessageData({
  newMessage,
  selectedVideo,
  signedInUserId,
  selectedRecipientId,
  addOptimisticMessage,
}: {
  newMessage: string;
  selectedVideo: File | null;
  signedInUserId: number;
  selectedRecipientId: number | null;
  addOptimisticMessage: (message: Message) => void;
}): {
  temporaryId: number;
  formData: FormData;
  optimisticMessage: Message | null;
} {
  const temporaryId = Date.now();
  const formData = handlePrepareFormData({
    newMessage,
    signedInUserId,
    selectedRecipientId,
    selectedVideo,
  });

  const optimisticMessage =
    !selectedVideo && selectedRecipientId !== null
      ? createOptimisticMessage({
          temporaryId,
          newMessage,
          signedInUserId,
          selectedRecipientId,
        })
      : null;

  if (optimisticMessage) {
    addOptimisticMessage(optimisticMessage);
  }

  return { temporaryId, formData, optimisticMessage };
}

async function handleProcessServerResponse({
  response,
  isIndividualMessageWithoutVideo,
  temporaryId,
  optimisticMessage,
  replaceOptimisticMessage,
}: {
  response: ActionResponse;
  isIndividualMessageWithoutVideo: boolean;
  temporaryId: number;
  optimisticMessage: Message | null;
  replaceOptimisticMessage: (
    temporaryId: number,
    confirmedMessage: Message
  ) => void;
}): Promise<void> {
  if (
    response.success &&
    response.messageId &&
    isIndividualMessageWithoutVideo
  ) {
    const confirmedMessage = {
      ...optimisticMessage!,
      id: response.messageId,
    };
    replaceOptimisticMessage(temporaryId, confirmedMessage);
  } else if (response.errors) {
    handleLogErrors(response.errors);
  } else {
    console.error('Unknown error sending message');
  }
}
