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
  signedInUserId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): void => {
  setMessages((prevMessages) =>
    prevMessages.map((msg) =>
      msg.id === messageId
        ? {
            ...msg,
            hiddenVideos: msg.hiddenVideos
              ? [...msg.hiddenVideos, signedInUserId]
              : [signedInUserId],
          }
        : msg
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
      handleDeleteVideoLocal(messageId, signedInUserId, setMessages);
    } else {
      console.error(failedToDeleteVideoMessage);
    }
  } else {
    handleDeleteVideoLocal(messageId, signedInUserId, setMessages);
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
  videoPublicId,
}: HandleSendMessageParams): Promise<void> {
  e.preventDefault();

  if (!handleValidateMessage(newMessage, selectedVideo)) {
    return;
  }

  setIsSending(true);

  const { temporaryId, formData, optimisticMessage } = handlePrepareMessage({
    newMessage,
    selectedVideo,
    signedInUserId,
    selectedRecipientId,
    addOptimisticMessage,
    videoPublicId,
  });

  try {
    const response = await action({}, formData);

    handleServerResponse({
      response,
      isIndividualMessageWithoutVideo:
        !selectedVideo && selectedRecipientId !== null,
      temporaryId,
      optimisticMessage,
      replaceOptimisticMessage,
    });
  } catch (error) {
    handleSendMessageError(error);
  } finally {
    handleResetFormState({ setNewMessage, setSelectedVideo, setIsSending });
  }
}

function handlePrepareMessage({
  newMessage,
  selectedVideo,
  signedInUserId,
  selectedRecipientId,
  addOptimisticMessage,
  videoPublicId,
}: {
  newMessage: string;
  selectedVideo: File | string | null;
  signedInUserId: number;
  selectedRecipientId: number | null;
  addOptimisticMessage: (message: Message) => void;
  videoPublicId?: string | null;
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
    videoPublicId,
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
  if (!response) {
    console.error('No response from server');
    return;
  }

  if (response.messageId && isIndividualMessageWithoutVideo) {
    const confirmedMessage = {
      ...optimisticMessage!,
      id: response.messageId,
    };
    replaceOptimisticMessage(temporaryId, confirmedMessage);
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
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | string | null>>;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}): void {
  setNewMessage('');
  setSelectedVideo(null);
  setIsSending(false);
}
