import React from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

export const subscribeToPusherEvents = (
  onMessageReceived: (data: PusherEventMessage) => void,
  onDeleteMessage: (messageId: number) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userId?: number
): (() => void) => {
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

export async function onDeleteVideo(
  messageId: number,
  removeFromDatabase: boolean,
  deleteVideo: (messageId: number, userId: number) => Promise<ActionResponse>,
  signedInUserId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<void> {
  if (removeFromDatabase) {
    const response = await deleteVideo(messageId, signedInUserId);
    if (response.success) {
      handleDeleteVideoLocal(messageId, setMessages);
    } else {
      console.error('Failed to delete video from the database');
    }
  } else {
    handleDeleteVideoLocal(messageId, setMessages);
  }
}

export async function onDeleteMessage(
  messageId: number,
  removeFromDatabase: boolean,
  deleteMessage: (messageId: number, userId: number) => Promise<ActionResponse>,
  signedInUserId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<void> {
  if (removeFromDatabase) {
    const response = await deleteMessage(messageId, signedInUserId);
    if (response.success) {
      handleDeleteMessageLocal(messageId, setMessages);
    } else {
      console.error('Failed to delete message from the database');
    }
  } else {
    handleDeleteMessageLocal(messageId, setMessages);
  }
}

export async function fetchMessagesForChat(
  recipientId: number | null,
  signedInUserId: number,
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{
    messages: unknown[];
    success: boolean;
    error?: string;
  }>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> {
  setLoading(true);
  const response = await getMessages(signedInUserId, recipientId ?? undefined);
  if (response.success) {
    setMessages(response.messages as Message[]);
  } else {
    console.error('Error fetching messages:', response.error);
  }
  setLoading(false);
}

export async function handleRecipientChange(
  event: React.ChangeEvent<HTMLSelectElement>,
  setSelectedRecipientId: React.Dispatch<React.SetStateAction<number | null>>,
  fetchMessagesForChat: (recipientId: number | null) => Promise<void>
): Promise<void> {
  const selectedId =
    event.target.value === 'group' ? null : Number(event.target.value);
  setSelectedRecipientId(selectedId);
  await fetchMessagesForChat(selectedId);
}

export async function handleSendMessage(
  e: React.FormEvent,
  newMessage: string,
  selectedVideo: File | null,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>,
  signedInUserId: number,
  selectedRecipientId: number | null,
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>,
  setNewMessage: React.Dispatch<React.SetStateAction<string>>,
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>
): Promise<void> {
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
    console.error(`Failed to send message: ${errorMessages}`);
  } else {
    console.error('Failed to send message due to unknown reasons.');
  }
}
