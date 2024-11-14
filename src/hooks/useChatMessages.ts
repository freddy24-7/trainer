import React, { useEffect, useState } from 'react';

import { Message, PusherEventMessage } from '@/types/message-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

export const useChatMessages = (
  signedInUserId: number,
  initialMessages: Message[],
  handleDeleteMessageLocal: (messageId: number) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const unsubscribe = subscribeToPusherEvents(
      (data: PusherEventMessage) => {
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
      handleDeleteMessageLocal,
      setLoading,
      signedInUserId
    );

    return () => {
      unsubscribe();
    };
  }, [signedInUserId, handleDeleteMessageLocal, setLoading]);

  return { messages, setMessages };
};
