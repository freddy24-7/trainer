import React from 'react';
import { toast } from 'react-toastify';

import { Message, PusherEventMessage } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { SignedInUser } from '@/types/user-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

export const subscribeToPusherEvents = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userId?: number
): (() => void) => {
  const handlePusherEvent = (data: PusherEventMessage): void => {
    console.log('Pusher event received:', data);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: data.id,
        content: data.content,
        sender: data.sender,
        createdAt: new Date(data.createdAt),
      },
    ]);
  };

  const cleanup = handleInitializePusher(handlePusherEvent, userId || 0);
  setLoading(false);

  return cleanup;
};

interface SendMessageOptions {
  newMessage: string;
  signedInUser: SignedInUser;
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  recipientId?: number | null;
}

export const handleSendMessageUtil = async (
  e: React.FormEvent,
  { newMessage, signedInUser, action, recipientId }: SendMessageOptions,
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
  e.preventDefault();

  if (!newMessage.trim()) {
    toast.error('Message cannot be empty.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', signedInUser.id.toString());

    if (recipientId) {
      formData.append('recipientId', recipientId.toString());
    }

    const response = await action({}, formData);

    if (response.success) {
      setNewMessage('');
      toast.success('Message sent!');
    } else if (response.errors) {
      const errorMessages = response.errors
        .map((error) => error.message)
        .join(', ');
      toast.error(`Failed to send message: ${errorMessages}`);
    } else {
      toast.error('Failed to send message due to unknown reasons.');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('An error occurred while sending the message.');
  }
};
