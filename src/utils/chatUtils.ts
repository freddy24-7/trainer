import React from 'react';
import { Message, PusherEventMessage } from '@/types/message-types';
import { initializePusher } from '@/utils/pusherUtils';
import { toast } from 'react-toastify';
import { ActionResponse } from '@/types/response-types';
import { SignedInUser } from '@/types/user-types';

export const subscribeToPusherEvents = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handlePusherEvent = (data: PusherEventMessage) => {
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

  const cleanup = initializePusher(handlePusherEvent);
  setLoading(false);

  return cleanup;
};

export const handleSendMessageUtil = async (
  e: React.FormEvent,
  newMessage: string,
  signedInUser: SignedInUser,
  action: (_prevState: any, params: FormData) => Promise<ActionResponse>,
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();

  if (!newMessage.trim()) {
    toast.error('Message cannot be empty.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', signedInUser.id.toString());

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
