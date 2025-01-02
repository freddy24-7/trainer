import React, { Dispatch, SetStateAction } from 'react';

import { ChatClientAction, Message } from '@/types/message-types';
import { handleSendMessage as sendMessageHandler } from '@/utils/chatUtils';

export async function handleRecipientChange({
  event,
  signedInUserId,
  getMessages,
  setMessages,
  setLoading,
  setSelectedRecipientId,
}: {
  event: React.ChangeEvent<HTMLSelectElement>;
  signedInUserId: number;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{ messages: Message[]; success: boolean; error?: string }>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSelectedRecipientId: Dispatch<SetStateAction<number | null>>;
}): Promise<void> {
  const recipientId =
    event.target.value === 'group' ? null : Number(event.target.value);

  setSelectedRecipientId(recipientId);
  setMessages([]);
  setLoading(true);

  try {
    const response = await getMessages(
      signedInUserId,
      recipientId ?? undefined
    );

    if (response.success) {
      setMessages(response.messages);
    } else {
      console.error('Failed to fetch messages:', response.error);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    setLoading(false);
  }
}

export function handleMemoizedRecipientChange({
  signedInUserId,
  getMessages,
  setMessages,
  setLoading,
  setSelectedRecipientId,
}: {
  signedInUserId: number;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{ messages: Message[]; success: boolean; error?: string }>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSelectedRecipientId: Dispatch<SetStateAction<number | null>>;
}): (event: React.ChangeEvent<HTMLSelectElement>) => Promise<void> {
  return (event: React.ChangeEvent<HTMLSelectElement>) =>
    handleRecipientChange({
      event,
      signedInUserId,
      getMessages,
      setMessages,
      setLoading,
      setSelectedRecipientId,
    });
}

export function handleMemoizedSendMessage({
  newMessage,
  selectedVideo,
  setIsSending,
  signedInUserId,
  selectedRecipientId,
  action,
  setNewMessage,
  setSelectedVideo,
  setMessages,
  addOptimisticMessage,
  replaceOptimisticMessage,
}: {
  newMessage: string;
  selectedVideo: File | string | null;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  signedInUserId: number;
  selectedRecipientId: number | null;
  action: ChatClientAction;
  setNewMessage: Dispatch<SetStateAction<string>>;
  setSelectedVideo: Dispatch<SetStateAction<File | string | null>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  addOptimisticMessage: (message: Message) => void;
  replaceOptimisticMessage: (messageId: number, newMessage: Message) => void;
}): (e: React.FormEvent) => Promise<void> {
  return async (e: React.FormEvent) => {
    await sendMessageHandler({
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
      addOptimisticMessage,
      replaceOptimisticMessage,
    });
  };
}
