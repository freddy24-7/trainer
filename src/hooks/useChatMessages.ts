import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';

import { PusherEventMessage, Message } from '@/types/message-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

export function handleIncomingMessage(
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

  const alreadyExists = trackedMessageIds.has(incomingMessage.id);

  if (alreadyExists) return;

  trackedMessageIds.add(incomingMessage.id);

  setMessages((prevMessages) => [...prevMessages, incomingMessage]);
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
  const trackedMessageIdsRef = useRef<Set<number>>(
    new Set(initialMessages.map((m) => m.id))
  );

  const handleDeleteMessageLocal = useCallback((messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    trackedMessageIdsRef.current.delete(messageId);
  }, []);

  const addOptimisticMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    trackedMessageIdsRef.current.add(message.id);
  }, []);

  const replaceOptimisticMessage = useCallback(
    (temporaryId: number, confirmedMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === temporaryId ? confirmedMessage : msg
        )
      );
      trackedMessageIdsRef.current.delete(temporaryId);
      trackedMessageIdsRef.current.add(confirmedMessage.id);
    },
    []
  );

  useEffect(() => {
    const onMessageReceived = (data: PusherEventMessage): void =>
      handleIncomingMessage(data, setMessages, trackedMessageIdsRef.current);

    const unsubscribe = subscribeToPusherEvents({
      onMessageReceived,
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

  return {
    messages,
    setMessages,
    handleDeleteMessage,
    addOptimisticMessage,
    replaceOptimisticMessage,
  };
};
