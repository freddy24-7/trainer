import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

interface UpdateState {
  recipientId: number | null;
  setSelectedRecipientId: Dispatch<SetStateAction<number | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

interface MessageParams {
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{ messages: unknown[]; success: boolean; error?: string }>;
  signedInUserId: number;
}

export function handleRecipientChange(
  { recipientId, setSelectedRecipientId, setLoading, setMessages }: UpdateState,
  { getMessages, signedInUserId }: MessageParams
): void {
  setSelectedRecipientId(recipientId);
  setLoading(true);
  getMessages(signedInUserId, recipientId ?? undefined).then((response) => {
    if (response.success) {
      setMessages(response.messages as Message[]);
    } else {
      console.error('Error fetching messages:', response.error);
    }
    setLoading(false);
  });
}

interface MessageData {
  newMessage: string;
  selectedRecipientId: number | null;
  signedInUserId: number;
  selectedVideo: File | null;
}

interface SendMessageState {
  setIsSending: Dispatch<SetStateAction<boolean>>;
  setNewMessage: Dispatch<SetStateAction<string>>;
  setSelectedVideo: Dispatch<SetStateAction<File | null>>;
}

export function handleSendMessage(
  messageData: MessageData,
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>,
  sendMessageState: SendMessageState
): void {
  const { newMessage, selectedRecipientId, signedInUserId, selectedVideo } =
    messageData;
  const { setIsSending, setNewMessage, setSelectedVideo } = sendMessageState;

  setIsSending(true);
  const formData = new FormData();
  formData.append('content', newMessage);
  formData.append('senderId', signedInUserId.toString());
  if (selectedRecipientId !== null)
    formData.append('recipientId', selectedRecipientId.toString());
  if (selectedVideo) formData.append('videoFile', selectedVideo);

  action({}, formData).then((response) => {
    setIsSending(false);
    if (response.success) {
      setNewMessage('');
      setSelectedVideo(null);
    } else {
      console.error('Failed to send message:', response.errors);
    }
  });
}

export function InitializePusherSubscription(
  signedInUserId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): void {
  useEffect(() => {
    return subscribeToPusherEvents(
      (data: PusherEventMessage): void => {
        const incomingMessage: Message = {
          id: data.id,
          content: data.content,
          sender: data.sender,
          createdAt: new Date(data.createdAt),
          videoUrl: data.videoUrl || null,
          recipientId: data.recipientId ?? null,
        };
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      },
      (messageId) =>
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        ),
      setLoading,
      signedInUserId
    );
  }, [signedInUserId, setMessages, setLoading]);
}

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
