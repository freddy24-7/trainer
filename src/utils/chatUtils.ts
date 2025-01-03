import React from 'react';
import { toast } from 'react-toastify';

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
  VideoData,
} from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import {
  handlePrepareFormData,
  createOptimisticMessage,
  handleValidateMessage,
} from '@/utils/messageUtils';
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

export async function handleSendMessage(
  params: HandleSendMessageParams,
  formData: FormData
): Promise<void> {
  const {
    newMessage,
    selectedVideo,
    setIsSending,
    setNewMessage,
    setSelectedVideo,
    addOptimisticMessage,
    replaceOptimisticMessage,
    action,
  } = params;

  console.debug('Sending message with parameters:', {
    newMessage,
    selectedVideo,
    formData,
  });

  if (!handleValidateMessage(newMessage, selectedVideo)) {
    return;
  }

  setIsSending(true);

  const { temporaryId, optimisticMessage } = handlePrepareMessage({
    newMessage,
    selectedVideo,
    signedInUserId: params.signedInUserId,
    selectedRecipientId: params.selectedRecipientId,
    addOptimisticMessage,
  });

  try {
    const response = await action({}, formData);
    console.debug('Full server response:', response);

    handleServerResponse({
      response,
      isIndividualMessageWithoutVideo:
        !selectedVideo && params.selectedRecipientId !== null,
      temporaryId,
      optimisticMessage,
      replaceOptimisticMessage,
    });
  } catch (error) {
    handleSendMessageError(error);
  }
}

function handlePrepareMessage({
  newMessage,
  selectedVideo,
  signedInUserId,
  selectedRecipientId,
  addOptimisticMessage,
}: {
  newMessage: string;
  selectedVideo: VideoData | null;
  signedInUserId: number;
  selectedRecipientId: number | null;
  addOptimisticMessage: (message: Message) => void;
}): {
  temporaryId: number;
  formData: FormData;
  optimisticMessage: Message | null;
} {
  const temporaryId = Date.now();
  console.debug('Preparing message with:', {
    newMessage,
    selectedVideo,
    signedInUserId,
    selectedRecipientId,
  });

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
          selectedVideo: null,
        })
      : null;

  console.debug('Generated optimistic message:', optimisticMessage);

  if (optimisticMessage) {
    addOptimisticMessage(optimisticMessage);
  }

  return { temporaryId, formData, optimisticMessage };
}

function handleServerResponse({
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
}): void {
  console.debug('Handling server response:', {
    response,
    isIndividualMessageWithoutVideo,
    temporaryId,
    optimisticMessage,
  });

  if (!response) {
    console.error('No response from server');
    return;
  }

  if (
    isIndividualMessageWithoutVideo &&
    response.messageId &&
    optimisticMessage
  ) {
    const messageId = Number(response.messageId);
    console.debug('Parsed messageId:', messageId);
    if (!isNaN(messageId)) {
      const confirmedMessage = {
        ...optimisticMessage,
        id: messageId,
      };
      console.debug('Replacing optimistic message with:', confirmedMessage);
      replaceOptimisticMessage(temporaryId, confirmedMessage);
    } else {
      console.error(
        'Invalid messageId in server response:',
        response.messageId
      );
    }
    return;
  }

  if (response.errors && Array.isArray(response.errors)) {
    handleLogErrors(response.errors);
    return;
  }

  if (Object.keys(response).length === 0) {
    console.debug('Received empty response object from server');
  } else {
    console.debug('Received response:', response);
  }
}

function handleLogErrors(errors: { message: string }[]): void {
  errors.forEach((error) => {
    toast.error(error.message);
  });
}

function handleSendMessageError(error: unknown): void {
  console.error('Error sending message:', error);
}

function handleResetFormState({
  setNewMessage,
  setSelectedVideo,
  setIsSending,
}: {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoData | null>>; // Updated type
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}): void {
  setNewMessage('');
  setSelectedVideo(null);
  setIsSending(false);
}
