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
  addOptimisticMessage: (message: Message) => void;
} => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [optimisticMessages, setOptimisticMessages] = useState<Set<number>>(
    new Set()
  );

  const handleDeleteMessageLocal = useCallback((messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    setOptimisticMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  const addOptimisticMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setOptimisticMessages((prev) => {
      const newSet = new Set(prev);
      newSet.add(message.id);
      return newSet;
    });
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

        // Avoid adding duplicate messages
        setMessages((prevMessages) => {
          const alreadyExists =
            prevMessages.some((msg) => msg.id === incomingMessage.id) ||
            optimisticMessages.has(incomingMessage.id);

          if (alreadyExists) {
            return prevMessages;
          }

          return [...prevMessages, incomingMessage];
        });
      },
      onDeleteMessage: handleDeleteMessageLocal,
      setLoading,
      userId: signedInUserId,
    });

    return () => {
      unsubscribe();
    };
  }, [
    signedInUserId,
    handleDeleteMessageLocal,
    setLoading,
    optimisticMessages,
  ]);

  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      handleDeleteMessageLocal(messageId);
    },
    [handleDeleteMessageLocal]
  );

  return { messages, setMessages, handleDeleteMessage, addOptimisticMessage };
};
