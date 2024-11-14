import React from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
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
