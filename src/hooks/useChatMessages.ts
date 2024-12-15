import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

function handleIncomingMessage(
  data: PusherEventMessage,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  trackedMessageIds: Set<number>
): void {
  const incomingMessage: Message = {
    id: data.id,
    content: data.content,
    sender: data.sender,
    createdAt: new Date(data.createdAt),
    videoUrl: data.videoUrl || null,
    recipientId: data.recipientId ?? null,
  };

  setMessages((prevMessages) => {
    const alreadyExists =
      prevMessages.some((msg) => msg.id === incomingMessage.id) ||
      trackedMessageIds.has(incomingMessage.id);

    if (alreadyExists) {
      return prevMessages;
    }

    return [...prevMessages, incomingMessage];
  });
}

export const useChatMessages = (
  signedInUserId: number,
  initialMessages: Message[],
  setLoading: Dispatch<SetStateAction<boolean>>
): {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  handleDeleteMessage: (messageId: number) => void;
  addOptimisticMessage: (message: Message) => void;
  replaceOptimisticMessage: (
    temporaryId: number,
    confirmedMessage: Message
  ) => void;
} => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [trackedMessageIds, setTrackedMessageIds] = useState<Set<number>>(
    new Set()
  );

  const handleDeleteMessageLocal = useCallback((messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    setTrackedMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  const addOptimisticMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTrackedMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(message.id);
      return newSet;
    });
  }, []);

  const replaceOptimisticMessage = useCallback(
    (temporaryId: number, confirmedMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === temporaryId ? confirmedMessage : msg
        )
      );
      setTrackedMessageIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(temporaryId);
        newSet.add(confirmedMessage.id);
        return newSet;
      });
    },
    []
  );

  useEffect(() => {
    const unsubscribe = subscribeToPusherEvents({
      onMessageReceived: (data: PusherEventMessage) =>
        handleIncomingMessage(data, setMessages, trackedMessageIds),
      onDeleteMessage: handleDeleteMessageLocal,
      setLoading,
      userId: signedInUserId,
    });

    return () => {
      unsubscribe();
    };
  }, [signedInUserId, handleDeleteMessageLocal, setLoading, trackedMessageIds]);

  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      handleDeleteMessageLocal(messageId);
    },
    [handleDeleteMessageLocal]
  );

  return {
    messages,
    setMessages,
    handleDeleteMessage,
    addOptimisticMessage,
    replaceOptimisticMessage,
  };
};
