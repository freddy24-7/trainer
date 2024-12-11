import React from 'react';

import {
  failedToDeleteVideoMessage,
  failedToDeleteMessageMessage,
  failedToFetchMessagesMessage,
  failedToSendMessageErrorsMessage,
  failedToSendMessageUnknownMessage,
} from '@/strings/serverStrings';
import {
  PusherEventMessage,
  Message,
  HandleOnDeleteVideoParams,
  HandleOnDeleteMessageParams,
  FetchMessagesForChatParams,
  HandleSendMessageParams,
  SubscribeToPusherEventsParams,
  HandleRecipientChangeParams,
} from '@/types/message-types';
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

export const handleDeleteMessageLocal = (
  messageId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): void => {
  setMessages((prevMessages) =>
    prevMessages.filter((msg) => msg.id !== messageId)
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
  setMessages,
}: HandleOnDeleteMessageParams): Promise<void> {
  if (removeFromDatabase) {
    const response = await deleteMessage(messageId, signedInUserId);
    if (response.success) {
      handleDeleteMessageLocal(messageId, setMessages);
    } else {
      console.error(failedToDeleteMessageMessage);
    }
  } else {
    handleDeleteMessageLocal(messageId, setMessages);
  }
}

export async function fetchMessagesForChat({
  recipientId,
  signedInUserId,
  getMessages,
  setMessages,
  setLoading,
}: FetchMessagesForChatParams): Promise<void> {
  setLoading(true);
  const response = await getMessages(signedInUserId, recipientId ?? undefined);
  if (response.success) {
    setMessages(response.messages as Message[]);
  } else {
    console.error(failedToFetchMessagesMessage, response.error);
  }
  setLoading(false);
}

export async function handleRecipientChange({
  event,
  setSelectedRecipientId,
  fetchMessagesForChat,
}: HandleRecipientChangeParams): Promise<void> {
  const selectedId =
    event.target.value === 'group' ? null : Number(event.target.value);
  setSelectedRecipientId(selectedId);
  await fetchMessagesForChat(selectedId);
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

  const response = await action({}, formData);

  setIsSending(false);

  if (response.success) {
    setNewMessage('');
    setSelectedVideo(null);
  } else if (response.errors) {
    const errorMessages = response.errors
      .map((error) => error.message)
      .join(', ');
    console.error(failedToSendMessageErrorsMessage, errorMessages);
  } else {
    console.error(failedToSendMessageUnknownMessage);
  }
}
