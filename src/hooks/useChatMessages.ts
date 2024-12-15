import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

export const useChatMessages = (
  signedInUserId: number,
  initialMessages: Message[],
  setLoading: Dispatch<SetStateAction<boolean>>
): {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  handleDeleteMessage: (messageId: number) => void;
} => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleDeleteMessageLocal = useCallback((messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPusherEvents({
      onMessageReceived: (data: PusherEventMessage) => {
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
      onDeleteMessage: handleDeleteMessageLocal,
      setLoading,
      userId: signedInUserId,
    });

    return () => {
      unsubscribe();
    };
  }, [signedInUserId, handleDeleteMessageLocal, setLoading]);

  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      handleDeleteMessageLocal(messageId);
    },
    [handleDeleteMessageLocal]
  );

  return { messages, setMessages, handleDeleteMessage };
};
