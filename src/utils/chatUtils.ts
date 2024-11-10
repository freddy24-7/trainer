import React from 'react';

import { PusherEventMessage } from '@/types/message-types';
import { handleInitializePusher } from '@/utils/pusherUtils';

export const subscribeToPusherEvents = (
  onMessageReceived: (data: PusherEventMessage) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userId?: number
): (() => void) => {
  const handlePusherEvent = (data: PusherEventMessage): void => {
    console.log('Pusher event received:', data);

    if (data.sender.id === userId) {
      return;
    }

    onMessageReceived(data);
  };

  const cleanup = handleInitializePusher(handlePusherEvent, userId || 0);
  setLoading(false);

  return cleanup;
};
