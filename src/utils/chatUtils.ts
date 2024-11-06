import React from 'react';

import { Message, PusherEventMessage } from '@/types/message-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

export const subscribeToPusherEvents = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userId?: number
): (() => void) => {
  const handlePusherEvent = (data: PusherEventMessage): void => {
    console.log('Pusher event received:', data);

    if (data.sender.id === userId) {
      return;
    }

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
